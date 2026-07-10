"use client";

import React, { useState, useMemo } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Layers,
  ListChecks,
  RotateCcw,
  Scale,
  Sparkles,
  Sun,
  Star,
  ArrowRight,
  XCircle,
  FileText,
  Target,
  Eye,
  Zap,
  Shield,
  Award,
  Heart,
  Plane,
  Scissors,
  GraduationCap,
  Briefcase,
  Music,
  Users,
  Hourglass,
  HelpCircle,
} from "lucide-react";
import { Devanagari, IAST } from "@/components/learning-runtime/chrome/typography";
import {
  KARANA_DB,
  EVENTS,
  VASAS,
  PORTIONS,
  SCENARIOS,
  portionStatus,
  getKarana,
  getEventType,
  getVasa,
  verdict,
  issueLabel,
  statusLabel,
  statusColor,
  STATUS_META,
  type KaranaCategory,
  type EventTypeKey,
  type VasaKey,
  type PortionKey,
  type StatusKey,
  type IssueKey,
  type Verdict,
} from "./data";

/* ── Design Tokens ─────────────────────────────────────── */
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "#A23A1E";
const TEAL = "#2E7D7B";

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232,199,114,0.12)";
}

function getEventIcon(key: EventTypeKey, size = 18) {
  switch (key) {
    case "marriage":
      return <Heart size={size} />;
    case "onset":
      return <Target size={size} />;
    case "surgery":
      return <Scissors size={size} />;
    default:
      return <HelpCircle size={size} />;
  }
}

/* ── Tab Navigation ────────────────────────────────────── */
type TabKey = "matcher" | "wheel" | "screener" | "integration";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "matcher", label: "Vāsa Integrator", icon: <Target size={15} /> },
  { key: "wheel", label: "11-Karaṇa Wheel", icon: <Sun size={15} /> },
  { key: "screener", label: "Scenario Screener", icon: <Scale size={15} /> },
  { key: "integration", label: "Integration Roadmap", icon: <Layers size={15} /> },
];

function TabBar({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  return (
    <div className="flex gap-1 rounded-xl p-1" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200"
            style={{
              background: isActive ? SURFACE : "transparent",
              color: isActive ? TEAL : INK_SECONDARY,
              border: isActive ? `1px solid ${HAIRLINE}` : "1px solid transparent",
              boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
              cursor: "pointer",
            }}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SVG KARANA WHEEL - 11-sector circular diagram
   ══════════════════════════════════════════════════════════ */

const WHEEL_SIZE = 460;
const WC = WHEEL_SIZE / 2;
const OUTER_R = 205;
const INNER_R = 125;
const LABEL_R = (OUTER_R + INNER_R) / 2;
const WEDGE_ANGLE = 360 / 11; // ~32.7° per karaṇa

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, rOuter: number, rInner: number, startAngle: number, endAngle: number) {
  const oS = polarToXY(cx, cy, rOuter, startAngle);
  const oE = polarToXY(cx, cy, rOuter, endAngle);
  const iS = polarToXY(cx, cy, rInner, endAngle);
  const iE = polarToXY(cx, cy, rInner, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${oS.x} ${oS.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${oE.x} ${oE.y}`,
    `L ${iS.x} ${iS.y}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${iE.x} ${iE.y}`,
    `Z`,
  ].join(" ");
}

export function BhadraAvoidanceIntegrator() {
  const [activeTab, setActiveTab] = useState<TabKey>("matcher");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("matcher");
  };

  return (
    <div
      data-interactive="bhadra-avoidance-integrator"
      className="w-full flex flex-col gap-5"
      style={{ color: INK_PRIMARY, fontFamily: "inherit" }}
    >
      {/* Premium Header Panel */}
      <section
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: "16px",
          background: SURFACE,
          padding: "1.5rem",
          boxShadow: "0 4px 20px rgba(184, 132, 33, 0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <div style={eyebrowStyle}>Lesson 23.3.2 — 11 Karaṇas & Bhadrā Avoidance</div>
            <h2
              style={{
                margin: "0.25rem 0 0.4rem",
                color: TEAL,
                fontSize: "1.75rem",
                fontFamily: "var(--font-cormorant, Georgia, serif)",
                fontWeight: 700,
              }}
            >
              Bhadrā Avoidance Integrator
            </h2>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6, fontSize: "0.92rem", maxWidth: 780 }}>
              Master the 11-karaṇa classification framework (7 cara, 4 sthira) and the Bhadrā/Viṣṭi avoidance rules.
              Explore the vāsa-sthāna (residence) modulations and the mukha/puccha (head/tail) window refinements.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200"
            style={{
              background: SURFACE_2,
              border: `1px solid ${HAIRLINE}`,
              color: TEAL,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={15} />
            Reset Explorer
          </button>
        </div>
      </section>

      {/* Tab Switcher */}
      <TabBar active={activeTab} onChange={setActiveTab} />

      {/* Sandbox Body */}
      <div key={resetKey} className="w-full">
        {activeTab === "matcher" && <VasaIntegratorTab />}
        {activeTab === "wheel" && <KaranaWheelTab />}
        {activeTab === "screener" && <ScreenerTab />}
        {activeTab === "integration" && <IntegrationTab />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   1. VĀSA INTEGRATOR TAB - Bhadrā vāsa & portion simulator
   ══════════════════════════════════════════════════════════ */

function VasaIntegratorTab() {
  const [eventKey, setEventKey] = useState<EventTypeKey>("onset");
  const [vasaKey, setVasaKey] = useState<VasaKey>("mrtyu");
  const [hoveredPortion, setHoveredPortion] = useState<PortionKey | null>(null);

  const ev = getEventType(eventKey)!;
  const vs = getVasa(vasaKey)!;
  const v = verdict(eventKey, vasaKey);

  // Illustrative start time
  const WINDOW_START = 360; // 06:00
  let cursor = WINDOW_START;

  const portionRows = PORTIONS.map((p) => {
    const start = cursor;
    cursor += p.minutes;
    const end = cursor;
    return { ...p, start, end, status: portionStatus(eventKey, vasaKey, p.key) };
  });

  const vasaMuted = eventKey === "marriage" || eventKey === "surgery";

  const clockFormat = (min: number) => {
    const m = ((min % 1440) + 1440) % 1440;
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Column: Selectors and Visual Timeline */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {/* Step 1: Event Type */}
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "16px",
            background: SURFACE,
            padding: "1.25rem",
          }}
        >
          <div style={sectionLabelStyle} className="mb-3">
            Step 1 — Choose event type
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {EVENTS.map((e) => {
              const isSelected = eventKey === e.key;
              return (
                <button
                  key={e.key}
                  type="button"
                  onClick={() => setEventKey(e.key)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl gap-2 transition-all duration-200 text-center"
                  style={{
                    border: `1px solid ${isSelected ? TEAL : HAIRLINE}`,
                    background: isSelected ? wash(TEAL, "0E") : SURFACE_2,
                    color: isSelected ? TEAL : INK_SECONDARY,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      background: isSelected ? TEAL : wash(INK_MUTED, "18"),
                      color: isSelected ? "#fff" : INK_SECONDARY,
                      padding: "0.4rem",
                      borderRadius: "50%",
                    }}
                  >
                    {getEventIcon(e.key, 18)}
                  </div>
                  <span style={{ fontSize: "0.82rem", fontWeight: 800 }}>{e.label}</span>
                  <span style={{ fontSize: "0.68rem", color: INK_MUTED }} className="leading-tight px-1">{e.description.slice(0, 48)}...</span>
                </button>
              );
            })}
          </div>
        </article>

        {/* Step 2: Vasa-sthāna */}
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "16px",
            background: SURFACE,
            padding: "1.25rem",
            opacity: vasaMuted ? 0.55 : 1.0,
            transition: "opacity 0.2s",
          }}
        >
          <div style={sectionLabelStyle} className="mb-2">
            Step 2 — Pick Bhadrā's Vāsa-Sthāna (Residence)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {VASAS.map((vItem) => {
              const isSelected = vasaKey === vItem.key;
              return (
                <button
                  key={vItem.key}
                  type="button"
                  disabled={vasaMuted}
                  onClick={() => setVasaKey(vItem.key)}
                  className="p-3 rounded-xl border transition-all duration-200 text-left cursor-pointer flex flex-col gap-1"
                  style={{
                    borderColor: isSelected && !vasaMuted ? BLUE : HAIRLINE,
                    background: isSelected && !vasaMuted ? wash(BLUE, "0E") : "transparent",
                    color: isSelected && !vasaMuted ? BLUE : INK_SECONDARY,
                  }}
                >
                  <div className="flex justify-between items-center w-full">
                    <span style={{ fontSize: "0.85rem", fontWeight: 800 }}>{vItem.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: SURFACE_2 }}>{vItem.devanagari}</span>
                  </div>
                  <span style={{ fontSize: "0.68rem", color: INK_MUTED }} className="leading-tight mt-0.5">{vItem.note.slice(0, 50)}...</span>
                </button>
              );
            })}
          </div>
          {vasaMuted && (
            <p className="text-[0.72rem] text-red-800 font-bold mt-2" style={{ color: VERMILION }}>
              {eventKey === "marriage"
                ? "Note: For marriage, Bhadrā is strictly barred across the entire window. Vāsa-sthāna has no effect."
                : "Note: For sharp actions, Bhadrā is universally usable. Vāsa-sthāna has no effect."}
            </p>
          )}
        </article>

        {/* Proportional window timeline */}
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "16px",
            background: SURFACE,
            padding: "1.25rem",
          }}
          className="flex flex-col gap-2"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={sectionLabelStyle}>Bhadrā Window Proportional Timeline (≈ 24h)</div>
            <span style={{ fontSize: "0.72rem", color: INK_MUTED }}>Illustrative Start: {clockFormat(WINDOW_START)}</span>
          </div>

          <div
            className="flex w-full overflow-hidden"
            style={{
              border: `1px solid ${HAIRLINE}`,
              borderRadius: "10px",
              height: 40,
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.04)",
            }}
          >
            {portionRows.map((p) => {
              const sm = STATUS_META[p.status];
              const isHovered = hoveredPortion === p.key;
              return (
                <div
                  key={p.key}
                  onMouseEnter={() => setHoveredPortion(p.key)}
                  onMouseLeave={() => setHoveredPortion(null)}
                  style={{
                    flexGrow: p.minutes,
                    background: sm.bg,
                    borderRight: p.key !== "puccha" ? `1px solid ${sm.border}` : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    opacity: isHovered ? 0.95 : 0.8,
                    transition: "all 0.1s",
                  }}
                  className="relative group"
                >
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: sm.color }}>{p.label}</span>
                </div>
              );
            })}
          </div>

          {/* Interactive portion details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
            {portionRows.map((p) => {
              const sm = STATUS_META[p.status];
              const isActive = hoveredPortion === p.key;
              const isRolled = p.end >= 1440;
              return (
                <div
                  key={p.key}
                  style={{
                    border: `1.5px solid ${isActive ? sm.color : sm.border}`,
                    borderRadius: "10px",
                    background: sm.bg,
                    padding: "0.75rem",
                    transition: "all 0.15s",
                    boxShadow: isActive ? "0 4px 10px rgba(0,0,0,0.05)" : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 900, color: sm.color }}>
                      {p.label} <span className="text-[10px] font-normal" style={{ color: INK_MUTED }}>({p.devanagari})</span>
                    </span>
                    <span
                      style={{ background: sm.color, color: "#fff", fontSize: "0.62rem", fontWeight: 900, padding: "0.1rem 0.35rem", borderRadius: 4 }}
                    >
                      {sm.label}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.7rem", color: INK_SECONDARY, lineHeight: 1.45 }}>{p.sub}</p>
                  <p style={{ margin: "0.4rem 0 0", fontSize: "0.7rem", color: INK_MUTED, fontWeight: 700 }}>
                    {clockFormat(p.start)} – {clockFormat(p.end)}{isRolled ? " (+1d)" : ""}
                  </p>
                </div>
              );
            })}
          </div>
        </article>
      </div>

      {/* Right Column: Diagnostic Verdict panel */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <article
          style={{
            border: `1px solid ${statusColor(v.status)}`,
            borderLeft: `5px solid ${statusColor(v.status)}`,
            borderRadius: "16px",
            background: STATUS_META[v.status].bg,
            padding: "1.25rem",
          }}
          className="flex flex-col gap-3"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "0.5rem" }}>
            <div>
              <div style={eyebrowStyle}>Diagnostic Verdict</div>
              <h3 style={{ margin: 0, color: statusColor(v.status), fontSize: "1.2rem", fontWeight: 900 }}>
                {v.headline}
              </h3>
            </div>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
              style={{ background: statusColor(v.status), color: "#fff" }}
            >
              {statusLabel(v.status)}
            </span>
          </div>

          <p style={{ margin: 0, fontSize: "0.82rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
            {v.detail}
          </p>

          <div
            style={{
              background: SURFACE_2,
              border: `1px solid ${HAIRLINE}`,
              borderRadius: "10px",
              padding: "0.65rem",
              fontSize: "0.76rem",
              color: INK_SECONDARY,
              lineHeight: 1.45,
            }}
          >
            <strong style={{ color: TEAL }}>Integration Discipline Clue:</strong>
            <p style={{ margin: "0.15rem 0 0" }}>
              Mukha (poison) and Puccha (tail) are always avoided for onsets.
              Vāsa-sthāna only grants middle portion usability for onsets. Weddings remain strictly barred.
            </p>
          </div>
        </article>

        {/* Vasa sthana legend reference */}
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "16px",
            background: SURFACE,
            padding: "1.25rem",
          }}
          className="flex flex-col gap-3"
        >
          <div style={sectionLabelStyle}>Vāsa-Sthāna Realms</div>
          <div className="flex flex-col gap-2 text-xs">
            {VASAS.map((item) => (
              <div key={item.key} style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.4rem" }}>
                <div className="flex justify-between items-center">
                  <strong style={{ color: INK_PRIMARY }}>{item.label} ({item.realm})</strong>
                  <span style={{ color: INK_MUTED }}>{item.devanagari}</span>
                </div>
                <p style={{ margin: "0.1rem 0 0", color: INK_SECONDARY, fontSize: "0.7rem", lineHeight: 1.35 }}>
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   2. WHEEL TAB - 11-Karaṇa Wheel Explorer
   ══════════════════════════════════════════════════════════ */

function KaranaWheelTab() {
  const [selectedKaranaNum, setSelectedKaranaNum] = useState<number>(7); // Default to Viṣṭi/Bhadrā (number 7)
  const [hoveredKaranaNum, setHoveredKaranaNum] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<"all" | KaranaCategory>("all");
  const [highlightBhadra, setHighlightBhadra] = useState(false);

  const selectedKarana = KARANA_DB.find((k) => k.number === selectedKaranaNum)!;

  const getWedgeProps = (num: number) => {
    const k = KARANA_DB.find((item) => item.number === num)!;
    
    // Highlight Bhadrā status
    const isBhadra = num === 7;
    const isHighlighted = highlightBhadra && isBhadra;

    // Filter categorization checks
    const matchesFilter = filterCategory === "all" || k.category === filterCategory;
    const isSelected = selectedKaranaNum === num;
    const isHovered = hoveredKaranaNum === num;

    let fill = matchesFilter ? (k.category === "cara" ? GREEN : BLUE) : "#CCCCCC";
    if (matchesFilter && isBhadra) {
      fill = VERMILION;
    }

    return {
      fill,
      opacity: matchesFilter ? (isSelected ? 1.0 : isHovered ? 0.9 : 0.7) : 0.15,
      stroke: isHighlighted ? "#FF0000" : isSelected ? "#fff" : isHovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.45)",
      strokeWidth: isHighlighted ? 3.0 : isSelected ? 3.0 : isHovered ? 1.8 : 0.8,
      className: isHighlighted ? "animate-pulse" : "",
    };
  };

  const hoveredKarana = hoveredKaranaNum !== null ? KARANA_DB.find((k) => k.number === hoveredKaranaNum) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left SVG Wheel visualizer */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {/* Visual filter controls */}
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "16px",
            background: SURFACE,
            padding: "1.25rem",
          }}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div style={sectionLabelStyle}>Interactive Filters & Visual Modes</div>

            {/* Bhadrā Toggle */}
            <div className="flex items-center gap-2">
              <label htmlFor="bhadra-highlight" style={{ fontSize: "0.78rem", fontWeight: 800, color: VERMILION }}>
                <Shield size={14} className="inline mr-1" />
                Highlight Viṣṭi (Bhadrā)
              </label>
              <input
                id="bhadra-highlight"
                type="checkbox"
                checked={highlightBhadra}
                onChange={(e) => setHighlightBhadra(e.target.checked)}
                className="w-4 h-4 accent-red-700 cursor-pointer"
                aria-checked={highlightBhadra}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: INK_SECONDARY }}>Filter Category:</span>
            <div className="flex gap-1.5">
              {(["all", "cara", "sthira"] as ("all" | KaranaCategory)[]).map((cat) => {
                const isActive = filterCategory === cat;
                const color = cat === "all" ? TEAL : cat === "cara" ? GREEN : BLUE;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilterCategory(cat)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: isActive ? color : HAIRLINE,
                      background: isActive ? color : "transparent",
                      color: isActive ? "#fff" : INK_SECONDARY,
                    }}
                  >
                    {cat === "all" ? "Show All 11" : cat === "cara" ? "Cara (Movable)" : "Sthira (Fixed)"}
                  </button>
                );
              })}
            </div>
          </div>
        </article>

        {/* SVG Diagram */}
        <div className="flex justify-center items-center py-4" style={{ background: SURFACE_2, borderRadius: "16px", border: `1px solid ${HAIRLINE}` }}>
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
            style={{ maxWidth: WHEEL_SIZE, maxHeight: WHEEL_SIZE }}
          >
            <circle cx={WC} cy={WC} r={OUTER_R + 10} fill="none" stroke={HAIRLINE} strokeWidth={1} />
            <circle cx={WC} cy={WC} r={OUTER_R} fill="#fff" stroke={HAIRLINE} strokeWidth={0.8} />

            {/* Render 11 wedges */}
            {KARANA_DB.map((k, idx) => {
              const startAngle = idx * WEDGE_ANGLE;
              const endAngle = (idx + 1) * WEDGE_ANGLE;
              const midAngle = startAngle + WEDGE_ANGLE / 2;
              const path = arcPath(WC, WC, OUTER_R, INNER_R, startAngle, endAngle);
              const labelPos = polarToXY(WC, WC, LABEL_R, midAngle);
              const textAngle = midAngle > 90 && midAngle < 270 ? midAngle + 180 : midAngle;
              
              const wedgeProps = getWedgeProps(k.number);

              return (
                <g
                  key={k.number}
                  onClick={() => setSelectedKaranaNum(k.number)}
                  onMouseEnter={() => setHoveredKaranaNum(k.number)}
                  onMouseLeave={() => setHoveredKaranaNum(null)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Wedge sector path */}
                  <path
                    d={path}
                    fill={wedgeProps.fill}
                    opacity={wedgeProps.opacity}
                    stroke={wedgeProps.stroke}
                    strokeWidth={wedgeProps.strokeWidth}
                    className={wedgeProps.className}
                    style={{ transition: "all 0.15s ease-out" }}
                  />

                  {/* Text indicator */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    transform={`rotate(${textAngle}, ${labelPos.x}, ${labelPos.y})`}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={selectedKaranaNum === k.number ? "#fff" : wedgeProps.opacity < 0.3 ? "rgba(0,0,0,0.12)" : "#fff"}
                    style={{
                      fontSize: "0.74rem",
                      fontWeight: 800,
                      pointerEvents: "none",
                      letterSpacing: "-0.02em",
                      userSelect: "none",
                    }}
                  >
                    {`${k.number}.${k.name}`}
                  </text>
                </g>
              );
            })}

            {/* Inner center compass dashboard disk */}
            <circle cx={WC} cy={WC} r={INNER_R - 5} fill={SURFACE} stroke={HAIRLINE} strokeWidth={2.5} />
            <circle cx={WC} cy={WC} r={INNER_R - 12} fill="#fff" opacity={0.5} />

            {/* Inner content */}
            <g transform={`translate(${WC}, ${WC})`}>
              {hoveredKarana || selectedKarana ? (
                (() => {
                  const target = hoveredKarana || selectedKarana;
                  const isCara = target.category === "cara";
                  const color = target.number === 7 ? VERMILION : isCara ? GREEN : BLUE;
                  return (
                    <>
                      {/* Sub-label */}
                      <text
                        y="-45"
                        textAnchor="middle"
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 900,
                          fill: INK_MUTED,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {`Karaṇa Limb #${target.number}`}
                      </text>

                      {/* Devanagari Name */}
                      <text
                        y="-22"
                        textAnchor="middle"
                        style={{
                          fontSize: "1.45rem",
                          fontWeight: 700,
                          fill: color,
                          fontFamily: "var(--font-cormorant, Georgia, serif)",
                        }}
                      >
                        {target.name}
                      </text>

                      {/* Pill Badge */}
                      <rect
                        x="-48"
                        y="2"
                        width="96"
                        height="18"
                        rx="9"
                        fill={wash(color, "18")}
                        stroke={color}
                        strokeWidth="1"
                      />
                      <text
                        y="14"
                        textAnchor="middle"
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 950,
                          fill: color,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {target.category === "cara" ? "Cara (Movable)" : "Sthira (Fixed)"}
                      </text>

                      {/* Presiding Deity */}
                      <text
                        y="38"
                        textAnchor="middle"
                        style={{
                          fontSize: "0.74rem",
                          fill: INK_SECONDARY,
                          fontWeight: 700,
                        }}
                      >
                        Deity: {target.deity}
                      </text>

                      {/* Interactive hint */}
                      <text
                        y="53"
                        textAnchor="middle"
                        style={{
                          fontSize: "0.65rem",
                          fill: INK_MUTED,
                          fontStyle: "italic",
                        }}
                      >
                        {hoveredKarana ? "(Hovering)" : "(Selected)"}
                      </text>
                    </>
                  );
                })()
              ) : (
                <>
                  <circle cx="0" cy="0" r="15" fill={wash(GOLD, "1C")} stroke={GOLD} strokeWidth={1} />
                  <path d="M 0 -10 L 0 10 M -10 0 L 10 0" stroke={GOLD} strokeWidth={1.5} />
                  <text y="35" textAnchor="middle" style={{ fontSize: "0.8rem", fill: INK_SECONDARY, fontWeight: 700 }}>
                    Select a Segment
                  </text>
                </>
              )}
            </g>
          </svg>
        </div>
      </div>

      {/* Right Column: Selected Karaṇa Details */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* Selected Karaṇa info */}
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "16px",
            background: SURFACE,
            padding: "1.25rem",
            borderLeft: `5px solid ${selectedKarana.number === 7 ? VERMILION : selectedKarana.category === "cara" ? GREEN : BLUE}`,
          }}
          className="flex flex-col gap-3.5"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap", width: "100%" }}>
            <div>
              <div style={eyebrowStyle}>Selected Karaṇa</div>
              <h3 style={{ margin: 0, color: selectedKarana.number === 7 ? VERMILION : selectedKarana.category === "cara" ? GREEN : BLUE, fontSize: "1.4rem", fontFamily: "var(--font-cormorant, Georgia, serif)", fontWeight: 700 }}>
                {selectedKarana.name}
              </h3>
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{
                background: wash(selectedKarana.number === 7 ? VERMILION : selectedKarana.category === "cara" ? GREEN : BLUE, "18"),
                color: selectedKarana.number === 7 ? VERMILION : selectedKarana.category === "cara" ? GREEN : BLUE,
                border: `1px solid ${selectedKarana.number === 7 ? VERMILION : selectedKarana.category === "cara" ? GREEN : BLUE}`,
              }}
            >
              {selectedKarana.category === "cara" ? "Cara" : "Sthira"}
            </span>
          </div>

          <div className="flex flex-col gap-2.5 text-sm" style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "0.85rem" }}>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div style={{ background: SURFACE_2, padding: "0.45rem", borderRadius: "6px" }}>
                <span style={{ color: INK_MUTED, fontWeight: 800 }}>Devanāgarī</span>
                <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, fontWeight: 700 }}>{selectedKarana.devanagari}</p>
              </div>
              <div style={{ background: SURFACE_2, padding: "0.45rem", borderRadius: "6px" }}>
                <span style={{ color: INK_MUTED, fontWeight: 800 }}>presiding deity</span>
                <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, fontWeight: 700 }}>{selectedKarana.deity}</p>
              </div>
            </div>

            <div>
              <span style={{ color: INK_MUTED, fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Astronomical Span
              </span>
              <p style={{ margin: "0.1rem 0 0", color: INK_SECONDARY }}>
                Spans 6° of Sun-Moon elongation, equivalent to half of a tithi.
              </p>
            </div>

            <div>
              <span style={{ color: INK_MUTED, fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Prescribed Effects
              </span>
              <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, lineHeight: 1.5, fontStyle: "italic" }}>
                "{selectedKarana.effects}"
              </p>
            </div>

            {selectedKarana.specialNote && (
              <div style={{ background: wash(VERMILION, "0C"), borderLeft: `3px solid ${VERMILION}`, padding: "0.5rem 0.65rem", borderRadius: "6px" }}>
                <span style={{ color: VERMILION, fontWeight: 900, fontSize: "0.72rem", textTransform: "uppercase" }}>
                  Cancellation / Exclusivity
                </span>
                <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, fontSize: "0.78rem", lineHeight: 1.4 }}>{selectedKarana.specialNote}</p>
              </div>
            )}
          </div>
        </article>

        {/* Legend */}
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "16px",
            background: SURFACE,
            padding: "1.25rem",
          }}
          className="flex flex-col gap-2.5"
        >
          <div style={sectionLabelStyle}>Color-Coding Legend</div>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }} />
              <span style={{ fontWeight: 800, color: INK_PRIMARY }}>Cara (Movable) Generally Favourable</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: VERMILION }} />
              <span style={{ fontWeight: 800, color: INK_PRIMARY }}>Viṣṭi/Bhadrā (Cara Avoided)</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: BLUE }} />
              <span style={{ fontWeight: 800, color: INK_PRIMARY }}>Sthira (Fixed) Limited-Application</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   3. SCREENER TAB - Case Dossier Clinic
   ══════════════════════════════════════════════════════════ */

function ScreenerTab() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedIssue, setSelectedIssue] = useState<IssueKey | null>(null);
  const [selectedVerdict, setSelectedVerdict] = useState<Verdict | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const scenario = SCENARIOS[scenarioIndex];

  const handleScenarioChange = (idx: number) => {
    setScenarioIndex(idx);
    setSelectedIssue(null);
    setSelectedVerdict(null);
    setShowAnswer(false);
  };

  const isIssueCorrect = selectedIssue === scenario.expectedIssue;
  const isVerdictCorrect = selectedVerdict === scenario.expectedVerdict;
  const allCorrect = isIssueCorrect && isVerdictCorrect;

  return (
    <div className="flex flex-col gap-4">
      {/* scenario indicators */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {SCENARIOS.map((s, idx) => {
          const isActive = idx === scenarioIndex;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleScenarioChange(idx)}
              className="flex-1 min-w-[90px] py-2.5 px-3 rounded-lg border font-bold text-xs transition-all duration-200 cursor-pointer text-center"
              style={{
                borderColor: isActive ? TEAL : HAIRLINE,
                background: isActive ? TEAL : SURFACE,
                color: isActive ? "#fff" : INK_SECONDARY,
              }}
            >
              Case #{s.id}
            </button>
          );
        })}
      </div>

      {/* Main console layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Case Dossier Detail */}
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "16px",
            background: SURFACE,
            padding: "1.5rem",
          }}
          className="lg:col-span-8 flex flex-col gap-4"
        >
          {/* File Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.75rem" }}>
            <div className="flex items-center gap-2">
              <Scale size={20} color={GOLD} />
              <h3 style={{ margin: 0, fontSize: "1.2rem", color: TEAL, fontWeight: 900 }}>
                Diagnostic Case File #{scenario.id}
              </h3>
            </div>
            <span
              className="px-2 py-0.5 rounded text-xs font-bold text-teal-800"
              style={{ background: wash(TEAL, "1E"), color: TEAL, border: `1px solid ${HAIRLINE}` }}
            >
              Event Class: {scenario.event}
            </span>
          </div>

          {/* Quick Details Pill Row */}
          <div className="grid grid-cols-3 gap-2">
            <div style={{ background: SURFACE_2, padding: "0.5rem", borderRadius: "8px", border: `1px solid ${HAIRLINE}`, textAlign: "center" }}>
              <div style={{ fontSize: "0.68rem", color: INK_MUTED, fontWeight: 800, textTransform: "uppercase" }}>Event Context</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 800, color: INK_PRIMARY, marginTop: "0.1rem" }}>{scenario.event}</div>
            </div>
            <div style={{ background: SURFACE_2, padding: "0.5rem", borderRadius: "8px", border: `1px solid ${HAIRLINE}`, textAlign: "center" }}>
              <div style={{ fontSize: "0.68rem", color: INK_MUTED, fontWeight: 800, textTransform: "uppercase" }}>Vāsa-sthāna</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 800, color: INK_PRIMARY, marginTop: "0.1rem" }}>
                {getVasa(scenario.vasa)?.label}
              </div>
            </div>
            <div style={{ background: SURFACE_2, padding: "0.5rem", borderRadius: "8px", border: `1px solid ${HAIRLINE}`, textAlign: "center" }}>
              <div style={{ fontSize: "0.68rem", color: INK_MUTED, fontWeight: 800, textTransform: "uppercase" }}>Active Karaṇa</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 800, color: INK_PRIMARY, marginTop: "0.1rem" }}>
                {scenario.karana}
              </div>
            </div>
          </div>

          {/* Brief Parchment Container */}
          <div
            style={{
              background: "#FFFDF9",
              border: `1px dashed ${GOLD}`,
              borderRadius: "10px",
              padding: "1rem",
              fontSize: "0.92rem",
              lineHeight: 1.6,
              color: INK_PRIMARY,
            }}
          >
            <strong style={{ color: GOLD }}>Scenario Case Brief:</strong>
            <p style={{ margin: "0.25rem 0 0" }}>{scenario.situation}</p>
          </div>

          {/* Quiz Forms */}
          <div className="flex flex-col gap-3">
            <div>
              <div style={sectionLabelStyle} className="mb-2">1. Diagnose primary systemic issue:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(["none", "single-limb-dominance", "cancellation-dosa-ignored", "vasa-sthana-ignored"] as IssueKey[]).map((key) => {
                  const isSelected = selectedIssue === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedIssue(key)}
                      className="p-2.5 text-left rounded-lg text-xs font-bold border transition-all duration-200 flex items-center justify-between cursor-pointer"
                      style={{
                        borderColor: isSelected ? TEAL : HAIRLINE,
                        background: isSelected ? wash(TEAL, "0C") : "transparent",
                        color: isSelected ? TEAL : INK_SECONDARY,
                      }}
                    >
                      <span>{issueLabel(key)}</span>
                      {isSelected && <Circle size={8} fill={TEAL} stroke={TEAL} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div style={sectionLabelStyle} className="mb-2">2. Deliver correct astrological verdict:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["favourable", "avoid", "exception-applies", "needs-context"] as Verdict[]).map((v) => {
                  const isSelected = selectedVerdict === v;
                  const color = statusColor(v === "exception-applies" ? "fitting" : v === "needs-context" ? "caution" : v === "favourable" ? "usable" : "barred");
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVerdict(v)}
                      className="p-3 text-center rounded-lg text-xs font-bold border transition-all duration-200 cursor-pointer"
                      style={{
                        borderColor: isSelected ? color : HAIRLINE,
                        background: isSelected ? wash(color, "12") : "transparent",
                        color: isSelected ? color : INK_SECONDARY,
                      }}
                    >
                      {v === "favourable" ? "Favourable" : v === "avoid" ? "Avoid" : v === "exception-applies" ? "Exception applies" : "Needs context"}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowAnswer(true)}
              className="flex-1 py-3 text-white rounded-xl font-bold transition-all duration-200 text-sm cursor-pointer"
              style={{ background: TEAL }}
            >
              Check Diagnosis Verdict
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedIssue(null);
                setSelectedVerdict(null);
                setShowAnswer(false);
              }}
              className="px-6 py-3 rounded-xl font-bold transition-all duration-200 text-sm cursor-pointer"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
            >
              Reset Case
            </button>
          </div>
        </article>

        {/* Diagnostic Verdict & Explanation */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {showAnswer && (
            <article
              style={{
                border: `1px solid ${allCorrect ? GREEN : VERMILION}`,
                borderLeft: `5px solid ${allCorrect ? GREEN : VERMILION}`,
                borderRadius: "16px",
                background: allCorrect ? wash(GREEN, "06") : wash(VERMILION, "06"),
                padding: "1.25rem",
              }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                {allCorrect ? <CheckCircle2 color={GREEN} size={20} /> : <AlertTriangle color={VERMILION} size={20} />}
                <h4 style={{ margin: 0, color: allCorrect ? GREEN : VERMILION, fontSize: "1.05rem", fontWeight: 800 }}>
                  {allCorrect ? "Selections Correct!" : "Diagnosis Mismatch"}
                </h4>
              </div>

              <div className="text-xs flex flex-col gap-1.5" style={{ color: INK_SECONDARY }}>
                <div className="flex justify-between">
                  <span>Issue:</span>
                  <strong style={{ color: isIssueCorrect ? GREEN : VERMILION }}>
                    {isIssueCorrect ? "Correct" : "Incorrect"}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Verdict:</span>
                  <strong style={{ color: isVerdictCorrect ? GREEN : VERMILION }}>
                    {isVerdictCorrect ? "Correct" : "Incorrect"}
                  </strong>
                </div>
              </div>

              {/* Dossier Report details */}
              <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "0.75rem" }} className="flex flex-col gap-2.5">
                <div>
                  <span style={{ fontSize: "0.7rem", color: INK_MUTED, fontWeight: 800, textTransform: "uppercase" }}>
                    Expected Issue
                  </span>
                  <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 800, color: INK_PRIMARY }}>
                    {issueLabel(scenario.expectedIssue)}
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: "0.7rem", color: INK_MUTED, fontWeight: 800, textTransform: "uppercase" }}>
                    Expected Verdict
                  </span>
                  <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 800, color: statusColor(scenario.expectedVerdict === "exception-applies" ? "fitting" : scenario.expectedVerdict === "needs-context" ? "caution" : scenario.expectedVerdict === "favourable" ? "usable" : "barred") }}>
                    {scenario.expectedVerdict === "favourable" ? "Favourable" : scenario.expectedVerdict === "avoid" ? "Avoid" : scenario.expectedVerdict === "exception-applies" ? "Exception applies" : "Needs context"}
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: "0.7rem", color: INK_MUTED, fontWeight: 800, textTransform: "uppercase" }}>
                    Scientific Rationale
                  </span>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.4 }}>
                    {scenario.explanation}
                  </p>
                </div>

                <div style={{ background: wash(GOLD, "0A"), borderLeft: `3px solid ${GOLD}`, padding: "0.5rem 0.6rem", borderRadius: "6px" }}>
                  <span style={{ fontSize: "0.7rem", color: GOLD, fontWeight: 900, textTransform: "uppercase" }}>
                    Client Communication Statement
                  </span>
                  <p style={{ margin: 0, fontSize: "0.76rem", color: INK_PRIMARY, lineHeight: 1.45, fontStyle: "italic" }}>
                    "{scenario.response}"
                  </p>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   4. INTEGRATION TAB - Visual Integration Roadmap
   ══════════════════════════════════════════════════════════ */

function IntegrationTab() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const integrationSteps = [
    { title: "Step 1 — Identify the event type", text: "Wedding, gṛha-praveśa, foundation-stone, travel, education, business-launch, or saṁskāra ceremony." },
    { title: "Step 2 — Determine the synodic cycle position", text: "Check which of the 60 half-tithi slots is active to map the presiding karaṇa limb." },
    { title: "Step 3 — Run absolute cancellation check", text: "First-pass exclusion: if Viṣṭi/Bhadrā is active, check the event-type. For wedding/saṁskāras, exclude the window immediately regardless of vāsa-sthāna." },
    { title: "Step 4 — Check exception & residence modulations", text: "For sharp actions, Bhadrā is usable (fitting). For non-marriage onsets, avoid Mukha/Puccha, and check if vāsa-sthāna is Pātāla (usable) or Svarga (caution)." },
    { title: "Step 5 — Apply event-type specific affinities", text: "Check if the active karaṇa matches the event-type (e.g. Vaṇija for commerce-launches, Kaulava for wedding-family characters)." },
    { title: "Step 6 — Integrate with tithi + vāra + nakṣatra + yoga", text: "Complete the pañcāṅga aggregation. No single limb overrides another; a favourable karaṇa does not save a ruled-out tithi." },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* 6-Step Visual Roadmap Pipeline */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "16px",
            background: SURFACE,
            padding: "1.25rem",
          }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <Layers size={18} color={TEAL} />
            <h3 style={{ margin: 0, color: TEAL, fontSize: "1.15rem", fontWeight: 800 }}>
              The 6-Step Integration Pipeline
            </h3>
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
            To avoid the single-limb-dominance failure mode, never select a date based solely on a favourable karaṇa.
            Apply this step-by-step pipeline to integrate karaṇas with the other limbs of the pañcāṅga.
          </p>
        </article>

        <div className="flex flex-col gap-2.5">
          {integrationSteps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveStep(idx)}
                onMouseLeave={() => setActiveStep(null)}
                className="p-4 rounded-xl border transition-all duration-200 cursor-pointer flex gap-3.5 items-start"
                style={{
                  borderColor: isActive ? TEAL : HAIRLINE,
                  background: isActive ? wash(TEAL, "08") : SURFACE,
                  boxShadow: isActive ? "0 4px 12px rgba(46, 125, 123, 0.06)" : "none",
                }}
              >
                <div
                  style={{
                    background: isActive ? TEAL : wash(GOLD, "20"),
                    color: isActive ? "#fff" : GOLD,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "0.85rem",
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>
                <div className="flex flex-col gap-1">
                  <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 900, color: isActive ? TEAL : INK_PRIMARY }}>
                    {step.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.84rem", lineHeight: 1.5, color: INK_SECONDARY }}>
                    {step.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Śloka Panel */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* Śloka Display */}
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "16px",
            background: SURFACE,
            padding: "1.25rem",
            boxShadow: "0 4px 15px rgba(184, 132, 33, 0.05)",
          }}
          className="flex flex-col gap-3.5"
        >
          <div className="flex items-center gap-1.5">
            <BookOpen size={18} color={GOLD} />
            <span style={{ fontSize: "0.82rem", fontWeight: 900, color: GOLD, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Foundational Śloka
            </span>
          </div>

          <div
            style={{
              background: "#FFFDF9",
              border: `1px solid ${HAIRLINE}`,
              borderRadius: "10px",
              padding: "1rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
            }}
          >
            <div style={{ color: INK_PRIMARY, lineHeight: 1.6 }}>
              <Devanagari size="sm">बव-बालव-कौलव-तैतिल-गरज-वणिजा विष्टिश्च चर-सप्तकम्।</Devanagari>
              <Devanagari size="sm">शकुनि-चतुष्पद-नाग-किंस्तुघ्न इति स्थिर-चतुष्टयम्॥</Devanagari>
              <Devanagari size="sm">एक-तिथिर्द्वि-करणमित्येकादश-विधाः स्मृताः॥</Devanagari>
            </div>
            <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "0.5rem" }}>
              <IAST size="sm">
                bava-bālava-kaulava-taitila-garaja-vaṇijā viṣṭiḥ ca cara-saptakam | śakuni-chatuṣpada-nāga-kiṁstughna iti sthira-chatuṣṭayam || eka-tithir dvi-karaṇam ity ekādaśa-vidhāḥ smṛtāḥ ||
              </IAST>
            </div>
          </div>

          <div className="text-xs flex flex-col gap-2 text-justify" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <p style={{ margin: 0 }}>
              <strong>Translation:</strong> "Bava, Bālava, Kaulava, Taitila, Garaja, Vaṇija, and Viṣṭi — these are the seven cara (movable) karaṇas. Śakuni, Chatuṣpada, Nāga, Kiṁstughna — these are the four sthira (fixed) karaṇas. Each tithi has two karaṇas; eleven types are remembered."
            </p>
            <p style={{ margin: 0, fontStyle: "italic", color: INK_MUTED }}>
              — Muhūrta-Cintāmaṇi, Chapter 2
            </p>
          </div>
        </article>

        {/* 5 Limbs diagram representation */}
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "16px",
            background: SURFACE,
            padding: "1.25rem",
          }}
          className="flex flex-col gap-3"
        >
          <div style={sectionLabelStyle}>Pañcāṅga Integration Map</div>
          <div className="flex flex-col gap-1.5">
            {[
              { label: "1. Tithi", active: false },
              { label: "2. Vāra", active: false },
              { label: "3. Nakṣatra", active: false },
              { label: "4. Yoga", active: false },
              { label: "5. Karaṇa (Limb in Focus)", active: true },
            ].map((limb) => (
              <div
                key={limb.label}
                className="p-2 rounded-lg text-xs font-bold flex items-center justify-between border"
                style={{
                  borderColor: limb.active ? TEAL : HAIRLINE,
                  background: limb.active ? wash(TEAL, "0A") : SURFACE_2,
                  color: limb.active ? TEAL : INK_SECONDARY,
                }}
              >
                <span>{limb.label}</span>
                {limb.active ? <Star size={10} fill={TEAL} stroke={TEAL} /> : null}
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

/* ── Common Styles ─────────────────────────────────────── */

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.78rem",
  fontWeight: 900,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const sectionLabelStyle: CSSProperties = {
  fontSize: "0.82rem",
  fontWeight: 900,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};
