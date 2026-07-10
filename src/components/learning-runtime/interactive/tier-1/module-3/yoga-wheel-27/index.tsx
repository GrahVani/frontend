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
  YOGA_DB,
  EVENT_TYPES,
  SCENARIOS,
  DANGEROUS_YOGAS,
  getYoga,
  getEventType,
  issueLabel,
  NATURE_META,
  verdictColor,
  verdictLabel,
  type YogaNature,
  type EventTypeKey,
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
    case "wedding":
      return <Heart size={size} />;
    case "griha-pravesha":
      return <InboxIcon size={size} />;
    case "foundation-stone":
      return <Target size={size} />;
    case "travel":
      return <Plane size={size} />;
    case "business-launch":
      return <Briefcase size={size} />;
    case "education-initiation":
      return <GraduationCap size={size} />;
    case "samskara-ceremony":
      return <Users size={size} />;
    default:
      return <HelpCircle size={size} />;
  }
}

// Inline fallback since Inbox icon is not standard in Lucide
function InboxIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function getShortName(name: string): string {
  switch (name) {
    case "Viṣkambha": return "Viṣk";
    case "Prīti": return "Prīt";
    case "Saubhāgya": return "Saub";
    case "Śobhana": return "Śobh";
    case "Atigaṇḍa": return "Atig";
    case "Sukarmā": return "Suka";
    case "Dhṛti": return "Dhṛt";
    case "Śūla": return "Śūla";
    case "Gaṇḍa": return "Gaṇḍ";
    case "Vṛddhi": return "Vṛdd";
    case "Dhruva": return "Dhru";
    case "Vyāghāta": return "Vyāg";
    case "Harṣaṇa": return "Harṣ";
    case "Vajra": return "Vajr";
    case "Siddhi": return "Sidd";
    case "Vyatīpāta": return "Vyat";
    case "Varīyān": return "Varī";
    case "Parigha": return "Pari";
    case "Śiva": return "Śiva";
    case "Siddha": return "Sidd";
    case "Sādhya": return "Sādh";
    case "Śubha": return "Śubh";
    case "Śukla": return "Śukl";
    case "Brahma": return "Brah";
    case "Aindra": return "Aind";
    case "Vaidhṛti": return "Vaid";
    default: return name.slice(0, 4);
  }
}

/* ── Tab Navigation ────────────────────────────────────── */
type TabKey = "matcher" | "mandala" | "screener" | "integration";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "matcher", label: "Affinity Matcher", icon: <Target size={15} /> },
  { key: "mandala", label: "Yoga Wheel", icon: <Sun size={15} /> },
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
   SVG YOGA WHEEL - 27-wedge radial diagram
   ══════════════════════════════════════════════════════════ */

const WHEEL_SIZE = 480;
const WC = WHEEL_SIZE / 2;
const OUTER_R = 210;
const INNER_R = 132;
const LABEL_R = (OUTER_R + INNER_R) / 2;
const WEDGE_ANGLE = 360 / 27;

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

export function YogaWheel27() {
  const [activeTab, setActiveTab] = useState<TabKey>("matcher");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("matcher");
  };

  return (
    <div
      data-interactive="yoga-wheel-27"
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
            <div style={eyebrowStyle}>Lesson 23.3.1 — 27 Yogas Categorized</div>
            <h2
              style={{
                margin: "0.25rem 0 0.4rem",
                color: TEAL,
                fontSize: "1.75rem",
                fontFamily: "var(--font-cormorant, Georgia, serif)",
                fontWeight: 700,
              }}
            >
              27-Yoga Explorer
            </h2>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6, fontSize: "0.92rem", maxWidth: 780 }}>
              Practice the classical 27-yoga classification framework (Viṣkambha through Vaidhṛti), exploring
              favourable event affinities, the Vyatīpāta/Vaidhṛti cancellation-doṣa rules, and regional-tradition variances.
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
        {activeTab === "matcher" && <MatcherTab />}
        {activeTab === "mandala" && <MandalaTab />}
        {activeTab === "screener" && <ScreenerTab />}
        {activeTab === "integration" && <IntegrationTab />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   1. MATCHER TAB - Event-Type Specific Affinity Matcher
   ══════════════════════════════════════════════════════════ */

function MatcherTab() {
  const [eventKey, setEventKey] = useState<EventTypeKey>("wedding");
  const [selectedNatures, setSelectedNatures] = useState<YogaNature[]>([]);
  const [cancellationChecked, setCancellationChecked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const event = getEventType(eventKey)!;

  const toggleNature = (nature: YogaNature) => {
    setSelectedNatures((prev) =>
      prev.includes(nature) ? prev.filter((n) => n !== nature) : [...prev, nature]
    );
  };

  const resetMatcher = () => {
    setSelectedNatures([]);
    setCancellationChecked(false);
    setShowAnswer(false);
  };

  const expectedNatures = event.favourableNatures;
  const isNaturesCorrect =
    selectedNatures.length === expectedNatures.length &&
    expectedNatures.every((n) => selectedNatures.includes(n));

  const isCancellationCorrect = cancellationChecked === event.avoidNatures.includes("cancellation-dosa");
  const allCorrect = isNaturesCorrect && isCancellationCorrect;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left matcher column */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {/* Step 1: Select Event */}
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "16px",
            background: SURFACE,
            padding: "1.25rem",
          }}
        >
          <div style={sectionLabelStyle} className="mb-3">
            Step 1 — Choose Event Type
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {EVENT_TYPES.map((e) => {
              const isSelected = eventKey === e.key;
              return (
                <button
                  key={e.key}
                  type="button"
                  onClick={() => {
                    setEventKey(e.key);
                    resetMatcher();
                  }}
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
                  <span style={{ fontSize: "0.78rem", fontWeight: 700 }}>{e.label}</span>
                </button>
              );
            })}
          </div>
        </article>

        {/* Step 2: Diagnostic Input */}
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "16px",
            background: SURFACE,
            padding: "1.25rem",
          }}
          className="flex flex-col gap-4"
        >
          {/* Nature selector */}
          <div>
            <div style={sectionLabelStyle} className="mb-2">
              Step 2 — Select all favourable yoga natures
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(["auspicious", "inauspicious", "cancellation-dosa"] as YogaNature[]).map((nature) => {
                const isSelected = selectedNatures.includes(nature);
                const meta = NATURE_META[nature];
                return (
                  <button
                    key={nature}
                    type="button"
                    onClick={() => toggleNature(nature)}
                    className="flex items-center gap-2.5 p-3 rounded-xl transition-all duration-200 text-left border"
                    style={{
                      borderColor: isSelected ? meta.color : HAIRLINE,
                      background: isSelected ? wash(meta.color, "1A") : "transparent",
                      color: isSelected ? meta.color : INK_SECONDARY,
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: meta.color,
                        display: "inline-block",
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 800 }}>{meta.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cancellation doṣa switch */}
          <div>
            <div style={sectionLabelStyle} className="mb-2">
              Step 3 — Does absolute cancellation-doṣa apply to this event?
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCancellationChecked(true)}
                className="flex-1 p-3 rounded-xl transition-all duration-200 text-center border font-bold text-sm"
                style={{
                  borderColor: cancellationChecked ? VERMILION : HAIRLINE,
                  background: cancellationChecked ? wash(VERMILION, "12") : "transparent",
                  color: cancellationChecked ? VERMILION : INK_SECONDARY,
                  cursor: "pointer",
                }}
              >
                <Shield size={16} className="inline mr-1.5" />
                Yes — Vyatīpāta/Vaidhṛti cancel this window
              </button>
              <button
                type="button"
                onClick={() => setCancellationChecked(false)}
                className="flex-1 p-3 rounded-xl transition-all duration-200 text-center border font-bold text-sm"
                style={{
                  borderColor: !cancellationChecked ? TEAL : HAIRLINE,
                  background: !cancellationChecked ? wash(TEAL, "0A") : "transparent",
                  color: !cancellationChecked ? TEAL : INK_SECONDARY,
                  cursor: "pointer",
                }}
              >
                <CheckCircle2 size={16} className="inline mr-1.5" />
                No — Absolute cancellation does not apply
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowAnswer(true)}
              className="flex-1 py-3 text-white rounded-xl font-bold transition-all duration-200 text-sm cursor-pointer"
              style={{ background: TEAL }}
            >
              Verify Matcher Selection
            </button>
            <button
              type="button"
              onClick={resetMatcher}
              className="px-6 py-3 rounded-xl font-bold transition-all duration-200 text-sm cursor-pointer"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
            >
              Clear
            </button>
          </div>
        </article>

        {/* Results display */}
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
              {allCorrect ? <CheckCircle2 color={GREEN} size={22} /> : <AlertTriangle color={VERMILION} size={22} />}
              <h4 style={{ margin: 0, color: allCorrect ? GREEN : VERMILION, fontSize: "1.1rem", fontWeight: 800 }}>
                {allCorrect ? "Perfect Assessment!" : "Verification Mismatch"}
              </h4>
            </div>

            <div style={{ fontSize: "0.9rem", color: INK_PRIMARY, lineHeight: 1.6 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong style={{ color: INK_SECONDARY }}>Your Category Assessment:</strong>{" "}
                {selectedNatures.length === 0 ? (
                  <span style={{ color: INK_MUTED }}>None selected</span>
                ) : (
                  selectedNatures.map((n) => NATURE_META[n].label).join(", ")
                )}
                {isNaturesCorrect ? (
                  <span className="text-green-700 ml-2 font-bold">✓ Correct</span>
                ) : (
                  <span className="text-red-700 ml-2 font-bold">✗ Incorrect</span>
                )}
                <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, marginTop: "0.25rem" }}>
                  Expected: {event.favourableNatures.map((n) => NATURE_META[n].label).join(", ")}
                </div>
              </div>

              <div>
                <strong style={{ color: INK_SECONDARY }}>Your Cancellation Assessment:</strong>{" "}
                {cancellationChecked ? "Cancellation active" : "No cancellation"}
                {isCancellationCorrect ? (
                  <span className="text-green-700 ml-2 font-bold">✓ Correct</span>
                ) : (
                  <span className="text-red-700 ml-2 font-bold">✗ Incorrect</span>
                )}
                <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, marginTop: "0.25rem" }}>
                  Expected: {event.avoidNatures.includes("cancellation-dosa") ? "Cancellation active" : "No cancellation"}
                </div>
              </div>
            </div>

            <div
              style={{
                background: SURFACE_2,
                borderRadius: "10px",
                padding: "0.75rem",
                fontSize: "0.86rem",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                border: `1px solid ${HAIRLINE}`,
              }}
            >
              <strong style={{ color: TEAL }}>Pedagogical Grounding:</strong> {event.explanation}
              {event.specialYoga && (
                <div style={{ marginTop: "0.4rem", color: GOLD, fontWeight: 700 }}>
                  <Sparkles size={13} className="inline mr-1" />
                  Key Yoga: {event.specialYoga} — {event.specialNote}
                </div>
              )}
            </div>
          </article>
        )}
      </div>

      {/* Right Column: Yoga Nature Legend Reference */}
      <div className="lg:col-span-4 flex flex-col gap-3">
        <div style={sectionLabelStyle}>Yoga Nature Classes</div>
        <div className="flex flex-col gap-2.5">
          {(["auspicious", "inauspicious", "cancellation-dosa"] as YogaNature[]).map((nature) => {
            const meta = NATURE_META[nature];
            const isFavourable = event.favourableNatures.includes(nature);
            const isAvoid = event.avoidNatures.includes(nature);
            let badge = null;
            if (isFavourable) {
              badge = (
                <span className="px-2 py-0.5 rounded text-xs font-bold text-green-800" style={{ background: wash(GREEN, "25") }}>
                  Favourable
                </span>
              );
            } else if (isAvoid) {
              badge = (
                <span className="px-2 py-0.5 rounded text-xs font-bold text-red-800" style={{ background: wash(VERMILION, "25") }}>
                  Avoid
                </span>
              );
            } else {
              badge = (
                <span className="px-2 py-0.5 rounded text-xs font-bold text-amber-800" style={{ background: wash(GOLD, "25") }}>
                  Check Context
                </span>
              );
            }

            return (
              <article
                key={nature}
                style={{
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: "12px",
                  background: SURFACE,
                  padding: "0.9rem",
                  borderLeft: `4px solid ${meta.color}`,
                }}
                className="flex flex-col gap-1"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                  <h4 style={{ margin: 0, color: meta.color, fontSize: "0.95rem", fontWeight: 800 }}>
                    {meta.label}
                  </h4>
                  {badge}
                </div>
                <p style={{ margin: 0, fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.45, marginTop: "0.15rem" }}>
                  {meta.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   2. MANDALA TAB - Interactive SVG 27-Yoga Wheel
   ══════════════════════════════════════════════════════════ */

function MandalaTab() {
  const [selectedYogaNum, setSelectedYogaNum] = useState<number>(4); // Default to Saubhāgya (number 4)
  const [filterMode, setFilterMode] = useState<"all" | YogaNature>("all");
  const [hoveredYogaNum, setHoveredYogaNum] = useState<number | null>(null);
  const [dangerHighlight, setDangerHighlight] = useState(false);

  const selectedYoga = YOGA_DB.find((y) => y.number === selectedYogaNum)!;
  const selMeta = NATURE_META[selectedYoga.nature];

  // Logic to determine segment rendering properties
  const getWedgeProps = (num: number) => {
    const yoga = YOGA_DB.find((y) => y.number === num)!;
    const meta = NATURE_META[yoga.nature];

    // Highlight cancellation-doṣa & dangerous toggle is ON
    const isDangerous = DANGEROUS_YOGAS.includes(num);
    const hasPulseHighlight = dangerHighlight && isDangerous;

    // Filter mode checks
    const matchesFilter = filterMode === "all" || yoga.nature === filterMode;
    const isSelected = selectedYogaNum === num;
    const isHovered = hoveredYogaNum === num;

    return {
      fill: matchesFilter ? meta.color : "#CCCCCC",
      opacity: matchesFilter ? (isSelected ? 1.0 : isHovered ? 0.9 : 0.75) : 0.15,
      stroke: hasPulseHighlight ? "#FF0000" : isSelected ? "#fff" : isHovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)",
      strokeWidth: hasPulseHighlight ? 3.0 : isSelected ? 3.0 : isHovered ? 1.8 : 0.8,
      className: hasPulseHighlight ? "animate-pulse" : "",
    };
  };

  const hoveredYoga = hoveredYogaNum !== null ? YOGA_DB.find((y) => y.number === hoveredYogaNum) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Visual Mandala and Filters */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {/* Visual Filters Dashboard */}
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "16px",
            background: SURFACE,
            padding: "1.25rem",
          }}
          className="flex flex-col gap-3.5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sun size={18} color={GOLD} />
              <div style={sectionLabelStyle}>Interactive Filters & Visual Modes</div>
            </div>

            {/* Danger Switch */}
            <div className="flex items-center gap-2">
              <label htmlFor="danger-toggle" style={{ fontSize: "0.78rem", fontWeight: 800, color: VERMILION }}>
                <Shield size={14} className="inline mr-1" />
                Highlight Dangerous & Cancellation Yogas
              </label>
              <input
                id="danger-toggle"
                type="checkbox"
                checked={dangerHighlight}
                onChange={(e) => setDangerHighlight(e.target.checked)}
                className="w-4 h-4 accent-red-700 cursor-pointer"
                aria-checked={dangerHighlight}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: INK_SECONDARY }}>Filter Nature:</span>
            <div className="flex gap-1.5">
              {(["all", "auspicious", "inauspicious", "cancellation-dosa"] as ("all" | YogaNature)[]).map((mode) => {
                const isActive = filterMode === mode;
                const color = mode === "all" ? TEAL : NATURE_META[mode].color;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFilterMode(mode)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: isActive ? color : HAIRLINE,
                      background: isActive ? color : "transparent",
                      color: isActive ? "#fff" : INK_SECONDARY,
                    }}
                  >
                    {mode === "all" ? "Show All 27" : NATURE_META[mode].label}
                  </button>
                );
              })}
            </div>
          </div>

          {dangerHighlight && (
            <div style={{ background: wash(VERMILION, "0E"), borderLeft: `3.5px solid ${VERMILION}`, padding: "0.6rem 0.80rem", borderRadius: "8px" }}>
              <p style={{ margin: 0, fontSize: "0.78rem", color: VERMILION, fontWeight: 700, lineHeight: 1.45 }}>
                <strong>Sūtra Alert:</strong> Pulsing segments show the 9 challenging/cancellation yogas explicitly warned against in classical texts.
                Vyatīpāta (17), Vaidhṛti (27), and Parigha (19) represent absolute cancellation-doṣa status.
              </p>
            </div>
          )}
        </article>

        {/* SVG Mandala Radial Diagram */}
        <div className="flex justify-center items-center py-4 shadow-inner" style={{ background: SURFACE_2, borderRadius: "16px", border: `1px solid ${HAIRLINE}` }}>
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
            style={{ maxWidth: WHEEL_SIZE, maxHeight: WHEEL_SIZE }}
          >
            {/* Outer rings decoration */}
            <circle cx={WC} cy={WC} r={OUTER_R + 10} fill="none" stroke={HAIRLINE} strokeWidth={1} />
            <circle cx={WC} cy={WC} r={OUTER_R} fill="#fff" stroke={HAIRLINE} strokeWidth={0.8} />

            {/* Render 27 Wedges */}
            {YOGA_DB.map((y, idx) => {
              const startAngle = idx * WEDGE_ANGLE;
              const endAngle = (idx + 1) * WEDGE_ANGLE;
              const midAngle = startAngle + WEDGE_ANGLE / 2;
              const path = arcPath(WC, WC, OUTER_R, INNER_R, startAngle, endAngle);
              const labelPos = polarToXY(WC, WC, LABEL_R, midAngle);
              const textAngle = midAngle > 90 && midAngle < 270 ? midAngle + 180 : midAngle;
              
              const wedgeProps = getWedgeProps(y.number);

              return (
                <g
                  key={y.number}
                  onClick={() => setSelectedYogaNum(y.number)}
                  onMouseEnter={() => setHoveredYogaNum(y.number)}
                  onMouseLeave={() => setHoveredYogaNum(null)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Segment path */}
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
                    fill={selectedYogaNum === y.number ? "#fff" : wedgeProps.opacity < 0.35 ? "rgba(0,0,0,0.12)" : "#fff"}
                    style={{
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      pointerEvents: "none",
                      letterSpacing: "-0.03em",
                      userSelect: "none",
                    }}
                  >
                    {`${y.number}.${getShortName(y.name)}`}
                  </text>
                </g>
              );
            })}

            {/* Hub Central Dashboard Disk */}
            <circle cx={WC} cy={WC} r={INNER_R - 5} fill={SURFACE} stroke={HAIRLINE} strokeWidth={2.5} />
            <circle cx={WC} cy={WC} r={INNER_R - 12} fill="#fff" opacity={0.5} />

            {/* Hub Text Content */}
            <g transform={`translate(${WC}, ${WC})`}>
              {hoveredYoga || selectedYoga ? (
                (() => {
                  const target = hoveredYoga || selectedYoga;
                  const targetMeta = NATURE_META[target.nature];
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
                        {`Yoga Limb #${target.number}`}
                      </text>

                      {/* Devanagari Name */}
                      <text
                        y="-22"
                        textAnchor="middle"
                        style={{
                          fontSize: "1.45rem",
                          fontWeight: 700,
                          fill: targetMeta.color,
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
                        fill={wash(targetMeta.color, "18")}
                        stroke={targetMeta.color}
                        strokeWidth="1"
                      />
                      <text
                        y="14"
                        textAnchor="middle"
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 950,
                          fill: targetMeta.color,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {targetMeta.label}
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

                      {/* Interactive clue */}
                      <text
                        y="53"
                        textAnchor="middle"
                        style={{
                          fontSize: "0.65rem",
                          fill: INK_MUTED,
                          fontStyle: "italic",
                        }}
                      >
                        {hoveredYoga ? "(Hovering)" : "(Selected)"}
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

      {/* Right Column: Selected Yoga Details */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* Dossier Card */}
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "16px",
            background: SURFACE,
            padding: "1.25rem",
            borderLeft: `5px solid ${selMeta.color}`,
          }}
          className="flex flex-col gap-3.5"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
            <div>
              <div style={eyebrowStyle}>Selected Yoga Limb</div>
              <h3 style={{ margin: 0, color: selMeta.color, fontSize: "1.4rem", fontFamily: "var(--font-cormorant, Georgia, serif)", fontWeight: 700 }}>
                {selectedYoga.name}
              </h3>
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: wash(selMeta.color, "18"), color: selMeta.color, border: `1px solid ${selMeta.color}` }}
            >
              {selMeta.label}
            </span>
          </div>

          <div className="flex flex-col gap-2.5 text-sm" style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "0.85rem" }}>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div style={{ background: SURFACE_2, padding: "0.45rem", borderRadius: "6px" }}>
                <span style={{ color: INK_MUTED, fontWeight: 800 }}>Devanāgarī</span>
                <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, fontWeight: 700 }}>{selectedYoga.devanagari}</p>
              </div>
              <div style={{ background: SURFACE_2, padding: "0.45rem", borderRadius: "6px" }}>
                <span style={{ color: INK_MUTED, fontWeight: 800 }}>Planetary Lord</span>
                <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, fontWeight: 700 }}>{selectedYoga.lord || "N/A"}</p>
              </div>
              <div style={{ background: SURFACE_2, padding: "0.45rem", borderRadius: "6px" }}>
                <span style={{ color: INK_MUTED, fontWeight: 800 }}>Ruler/Sage</span>
                <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, fontWeight: 700 }}>{selectedYoga.ruler}</p>
              </div>
              <div style={{ background: SURFACE_2, padding: "0.45rem", borderRadius: "6px" }}>
                <span style={{ color: INK_MUTED, fontWeight: 800 }}>presiding deity</span>
                <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, fontWeight: 700 }}>{selectedYoga.deity}</p>
              </div>
            </div>

            <div>
              <span style={{ color: INK_MUTED, fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Astronomical Span
              </span>
              <p style={{ margin: "0.1rem 0 0", color: INK_SECONDARY }}>
                13°20′ space derived from Sun-Moon longitude-sum (Limb 4 of pañcāṅga).
              </p>
            </div>

            <div>
              <span style={{ color: INK_MUTED, fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Classical Effects
              </span>
              <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, lineHeight: 1.5, fontStyle: "italic" }}>
                "{selectedYoga.effects}"
              </p>
            </div>

            {selectedYoga.specialNote && (
              <div style={{ background: wash(VERMILION, "0C"), borderLeft: `3px solid ${VERMILION}`, padding: "0.5rem 0.65rem", borderRadius: "6px" }}>
                <span style={{ color: VERMILION, fontWeight: 900, fontSize: "0.72rem", textTransform: "uppercase" }}>
                  Cancellation Rule
                </span>
                <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, fontSize: "0.78rem", lineHeight: 1.4 }}>{selectedYoga.specialNote}</p>
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
            {Object.keys(NATURE_META).map((key) => {
              const meta = NATURE_META[key as YogaNature];
              return (
                <div key={key} className="flex items-center gap-2">
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color }} />
                  <span style={{ fontWeight: 800, color: INK_PRIMARY }}>{meta.label}</span>
                </div>
              );
            })}
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
      {/* Step selection */}
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

      {/* Main Panel */}
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
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ background: wash(GOLD, "1E"), color: GOLD, border: `1px solid ${HAIRLINE}` }}
            >
              Class: {scenario.event}
            </span>
          </div>

          {/* Quick Details Pill Row */}
          <div className="grid grid-cols-3 gap-2">
            <div style={{ background: SURFACE_2, padding: "0.5rem", borderRadius: "8px", border: `1px solid ${HAIRLINE}`, textAlign: "center" }}>
              <div style={{ fontSize: "0.68rem", color: INK_MUTED, fontWeight: 800, textTransform: "uppercase" }}>Target Event</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 800, color: INK_PRIMARY, marginTop: "0.1rem" }}>{scenario.event}</div>
            </div>
            <div style={{ background: SURFACE_2, padding: "0.5rem", borderRadius: "8px", border: `1px solid ${HAIRLINE}`, textAlign: "center" }}>
              <div style={{ fontSize: "0.68rem", color: INK_MUTED, fontWeight: 800, textTransform: "uppercase" }}>Active Yoga</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 800, color: INK_PRIMARY, marginTop: "0.1rem" }}>{`#${scenario.yogaNumber} ${scenario.yoga}`}</div>
            </div>
            <div style={{ background: SURFACE_2, padding: "0.5rem", borderRadius: "8px", border: `1px solid ${HAIRLINE}`, textAlign: "center" }}>
              <div style={{ fontSize: "0.68rem", color: INK_MUTED, fontWeight: 800, textTransform: "uppercase" }}>Yoga Nature</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 800, color: NATURE_META[scenario.nature].color, marginTop: "0.1rem" }}>
                {NATURE_META[scenario.nature].label}
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

          {/* Diagnostic Inputs */}
          <div className="flex flex-col gap-3">
            <div>
              <div style={sectionLabelStyle} className="mb-2">1. Diagnose primary systemic issue:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(["none", "single-limb-dominance", "cancellation-dosa-ignored", "parigha-variance-ignored", "challenging-yoga-underapplied"] as IssueKey[]).map((key) => {
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
                  const color = verdictColor(v);
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
                      {verdictLabel(v)}
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
                  {allCorrect ? "Selections Correct!" : "Diagnosis Incomplete"}
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
                  <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 800, color: verdictColor(scenario.expectedVerdict) }}>
                    {verdictLabel(scenario.expectedVerdict)}
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
    { title: "Step 2 — Determine Sun-Moon longitude-sum", text: "Compute the angular coordinates of both luminaries to identify which of the 27 yogas is active." },
    { title: "Step 3 — Run cancellation-doṣa exclusion", text: "First-pass exclusion: if Vyatīpāta (17), Vaidhṛti (27), or (regional) Parigha (19) is active, exclude the candidate window immediately." },
    { title: "Step 4 — Apply event-type affinity weighting", text: "For remaining candidates, check if the yoga matches the event (e.g. Saubhāgya for wedding, Siddhi for launch, Dhruva for foundation)." },
    { title: "Step 5 — Integrate with other pañcāṅga-limbs", text: "Check tithi-classification (Lesson 23.2.1), vāra-lord effects (Lesson 23.2.2), and nakṣatra classification (Lesson 23.2.3). A good yoga does not save a bad tithi." },
    { title: "Step 6 — Complete chart-correspondence analysis", text: "Examine Jaimini/Parāśarī placements and compatibility strengths like tārā-bala (M23 Chapter 3 developments)." },
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
            To avoid the single-limb-dominance failure mode, never select a date based solely on a favourable yoga.
            Apply this step-by-step pipeline to integrate yogas with the other limbs of the pañcāṅga.
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
              <Devanagari size="md">सप्तविंशति-योगाः स्युः रवि-चन्द्र-योगतः संज्ञया।</Devanagari>
              <Devanagari size="md">विष्कम्भादयः वैधृत्यन्ताः पञ्चाङ्गे गणिताः स्मृताः॥</Devanagari>
            </div>
            <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "0.5rem" }}>
              <IAST size="sm">
                sapta-viṁśati-yogāḥ syuḥ ravi-candra-yogataḥ saṁjñayā | viṣkambhādayaḥ vaidhṛty-antāḥ pañcāṅge gaṇitāḥ smṛtāḥ ||
              </IAST>
            </div>
          </div>

          <div className="text-xs flex flex-col gap-2 text-justify" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <p style={{ margin: 0 }}>
              <strong>Translation:</strong> "There are 27 yogas, designated from the Sun-Moon angular-sum, named from Viṣkambha through Vaidhṛti, computed within the pañcāṅga framework."
            </p>
            <p style={{ margin: 0, fontStyle: "italic", color: INK_MUTED }}>
              — Muhūrta-Cintāmaṇi, Chapter 4
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
              { label: "4. Yoga (Limb in Focus)", active: true },
              { label: "5. Karaṇa", active: false },
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
