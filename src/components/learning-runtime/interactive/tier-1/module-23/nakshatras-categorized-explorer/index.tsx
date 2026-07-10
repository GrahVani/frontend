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
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  CATEGORIES,
  EVENT_TYPES,
  INTEGRATION_STEPS,
  ISSUE_OPTIONS,
  NAKSHATRAS,
  SCENARIOS,
  getCategory,
  getEventType,
  issueLabel,
  verdictColor,
  verdictLabel,
  type CategoryKey,
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
    case "surgical-procedure":
      return <Scissors size={size} />;
    case "education-initiation":
      return <GraduationCap size={size} />;
    case "business-launch":
      return <Briefcase size={size} />;
    case "aesthetic-event":
      return <Music size={size} />;
    case "pitri-tarpana":
      return <Users size={size} />;
    case "quick-completion":
      return <Hourglass size={size} />;
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
    case "Aśvinī": return "Aśv";
    case "Bharaṇī": return "Bha";
    case "Kṛttikā": return "Kṛt";
    case "Rohiṇī": return "Roh";
    case "Mṛgaśīrṣā": return "Mṛg";
    case "Ārdrā": return "Ārd";
    case "Punarvasu": return "Pun";
    case "Puṣya": return "Puṣ";
    case "Āśleṣā": return "Āśl";
    case "Maghā": return "Mag";
    case "Pūrvaphalgunī": return "P.Pha";
    case "Uttaraphalgunī": return "U.Pha";
    case "Hasta": return "Has";
    case "Citrā": return "Cit";
    case "Svātī": return "Svā";
    case "Viśākhā": return "Viś";
    case "Anurādhā": return "Anu";
    case "Jyeṣṭhā": return "Jye";
    case "Mūla": return "Mūl";
    case "Pūrvāṣāḍhā": return "P.Āṣ";
    case "Uttarāṣāḍhā": return "U.Āṣ";
    case "Śravaṇa": return "Śra";
    case "Dhaniṣṭhā": return "Dha";
    case "Śatabhiṣā": return "Śat";
    case "Pūrvabhādrapadā": return "P.Bh";
    case "Uttarabhādrapadā": return "U.Bh";
    case "Revatī": return "Rev";
    default: return name.slice(0, 3);
  }
}

/* ── Tab Navigation ────────────────────────────────────── */
type TabKey = "matcher" | "mandala" | "screener" | "integration";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "matcher", label: "Affinity Matcher", icon: <Target size={15} /> },
  { key: "mandala", label: "Nakṣatra Mandala", icon: <Sun size={15} /> },
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
   SVG MANDALA WHEEL - 27-sector astronomical ring
   ══════════════════════════════════════════════════════════ */

const WHEEL_SIZE = 480;
const WC = WHEEL_SIZE / 2; // Center
const OUTER_R = 220;
const INNER_R = 138;
const LABEL_R = (OUTER_R + INNER_R) / 2;
const WEDGE_ANGLE = 360 / 27; // ~13.33 degrees per nakṣatra

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  // -90deg rotates the starting sector to 12 o'clock
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

export function NakshatrasCategorizedExplorer() {
  const [activeTab, setActiveTab] = useState<TabKey>("matcher");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("matcher");
  };

  return (
    <div
      data-interactive="nakshatras-categorized-explorer"
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
            <div style={eyebrowStyle}>Lesson 23.2.3 — 27 Nakṣatras Categorized</div>
            <h2
              style={{
                margin: "0.25rem 0 0.4rem",
                color: TEAL,
                fontSize: "1.75rem",
                fontFamily: "var(--font-cormorant, Georgia, serif)",
                fontWeight: 700,
              }}
            >
              Nakṣatras Categorized Explorer
            </h2>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6, fontSize: "0.92rem", maxWidth: 780 }}>
              Master the seven-category nakṣatra-classification framework (Cara, Sthira, Ugra, Mṛdu, Tīkṣṇa, Miśra, Laghu)
              for event-type-specific muhūrta selection, exploring Puṣya's universal favourability, Tīkṣṇa exception contexts,
              and the Mūla-doṣa distinction.
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

      {/* Main Sandbox Area */}
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
   1. MATCHER TAB - Affinity Matcher Clinic
   ══════════════════════════════════════════════════════════ */

function MatcherTab() {
  const [eventKey, setEventKey] = useState<EventTypeKey>("wedding");
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>([]);
  const [exceptionMarked, setExceptionMarked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentEvent = getEventType(eventKey)!;

  const toggleCategory = (key: CategoryKey) => {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const resetMatcher = () => {
    setSelectedCategories([]);
    setExceptionMarked(false);
    setShowAnswer(false);
  };

  const isCategoriesCorrect = useMemo(() => {
    const expected = currentEvent.favourableCategories;
    return (
      selectedCategories.length === expected.length &&
      expected.every((key) => selectedCategories.includes(key))
    );
  }, [selectedCategories, currentEvent]);

  const hasSpecial = !!currentEvent.specialNakshatra;
  const isExceptionCorrect = exceptionMarked === hasSpecial;
  const allCorrect = isCategoriesCorrect && isExceptionCorrect;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Column: Event Cards & Interactive Matcher */}
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
            Step 1 — Select event type to analyze
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
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
          {/* Favourable Categories Selection */}
          <div>
            <div style={sectionLabelStyle} className="mb-2">
              Step 2 — Select all favourable nakṣatra-categories
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((c) => {
                const isSelected = selectedCategories.includes(c.key);
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => toggleCategory(c.key)}
                    className="flex items-center gap-2.5 p-3 rounded-xl transition-all duration-200 text-left"
                    style={{
                      border: `1px solid ${isSelected ? c.color : HAIRLINE}`,
                      background: isSelected ? wash(c.color, "1A") : "transparent",
                      color: isSelected ? c.color : INK_SECONDARY,
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: c.color,
                        display: "inline-block",
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 800 }}>{c.name}</span>
                      <span style={{ fontSize: "0.68rem", color: INK_MUTED }}>{c.meaning}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exception Toggle */}
          <div>
            <div style={sectionLabelStyle} className="mb-2">
              Step 3 — Is there a special nakṣatra exception or regional variance?
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setExceptionMarked(true)}
                className="flex-1 p-3 rounded-xl transition-all duration-200 text-center border font-bold text-sm"
                style={{
                  borderColor: exceptionMarked ? GOLD : HAIRLINE,
                  background: exceptionMarked ? wash(GOLD, "15") : "transparent",
                  color: exceptionMarked ? GOLD : INK_SECONDARY,
                  cursor: "pointer",
                }}
              >
                <Shield size={16} className="inline mr-1.5" />
                Yes — Special Nakṣatra / Exception Applies
              </button>
              <button
                type="button"
                onClick={() => setExceptionMarked(false)}
                className="flex-1 p-3 rounded-xl transition-all duration-200 text-center border font-bold text-sm"
                style={{
                  borderColor: !exceptionMarked ? TEAL : HAIRLINE,
                  background: !exceptionMarked ? wash(TEAL, "0A") : "transparent",
                  color: !exceptionMarked ? TEAL : INK_SECONDARY,
                  cursor: "pointer",
                }}
              >
                <CheckCircle2 size={16} className="inline mr-1.5" />
                No — Standard Category Rule
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowAnswer(true)}
              className="flex-1 py-3 bg-teal-800 text-white rounded-xl font-bold transition-all duration-200 hover:bg-teal-900 cursor-pointer text-sm"
              style={{ background: TEAL }}
            >
              Verify Matcher Selection
            </button>
            <button
              type="button"
              onClick={resetMatcher}
              className="px-6 py-3 rounded-xl font-bold transition-all duration-200 cursor-pointer text-sm"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
            >
              Clear
            </button>
          </div>
        </article>

        {/* Diagnostic Results Card */}
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
              {allCorrect ? (
                <CheckCircle2 color={GREEN} size={22} />
              ) : (
                <AlertTriangle color={VERMILION} size={22} />
              )}
              <h4 style={{ margin: 0, color: allCorrect ? GREEN : VERMILION, fontSize: "1.1rem", fontWeight: 800 }}>
                {allCorrect ? "Perfect Assessment!" : "Verification Mismatch"}
              </h4>
            </div>

            <div style={{ fontSize: "0.9rem", color: INK_PRIMARY, lineHeight: 1.6 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong style={{ color: INK_SECONDARY }}>Your Category Assessment:</strong>{" "}
                {selectedCategories.length === 0 ? (
                  <span style={{ color: INK_MUTED }}>None selected</span>
                ) : (
                  selectedCategories.map((k) => getCategory(k)?.name).join(", ")
                )}
                {isCategoriesCorrect ? (
                  <span className="text-green-700 ml-2 font-bold">✓ Correct</span>
                ) : (
                  <span className="text-red-700 ml-2 font-bold">✗ Incorrect</span>
                )}
                <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, marginTop: "0.25rem" }}>
                  Expected: {currentEvent.favourableCategories.map((k) => getCategory(k)?.name).join(", ")}
                </div>
              </div>

              <div>
                <strong style={{ color: INK_SECONDARY }}>Your Exception Diagnostic:</strong>{" "}
                {exceptionMarked ? "Exception Applies" : "General Rule Only"}
                {isExceptionCorrect ? (
                  <span className="text-green-700 ml-2 font-bold">✓ Correct</span>
                ) : (
                  <span className="text-red-700 ml-2 font-bold">✗ Incorrect</span>
                )}
                <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, marginTop: "0.25rem" }}>
                  Expected: {hasSpecial ? "Exception applies" : "General rule applies"}
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
              <strong style={{ color: TEAL }}>Pedagogical Grounding:</strong> {currentEvent.explanation}
              {currentEvent.specialNote && (
                <div style={{ marginTop: "0.4rem", color: GOLD, fontWeight: 700 }}>
                  <Sparkles size={13} className="inline mr-1" />
                  Exception: {currentEvent.specialNote}
                </div>
              )}
            </div>
          </article>
        )}
      </div>

      {/* Right Column: Category Quick Reference */}
      <div className="lg:col-span-4 flex flex-col gap-3">
        <div style={sectionLabelStyle}>Category Reference</div>
        <div className="flex flex-col gap-2.5">
          {CATEGORIES.map((c) => {
            const isFavourable = currentEvent.favourableCategories.includes(c.key);
            const isAvoid = currentEvent.avoidCategories.includes(c.key);
            let statusBadge = null;
            if (isFavourable) {
              statusBadge = (
                <span className="px-2 py-0.5 rounded text-xs font-bold text-green-800" style={{ background: wash(GREEN, "25") }}>
                  Favourable
                </span>
              );
            } else if (isAvoid) {
              statusBadge = (
                <span className="px-2 py-0.5 rounded text-xs font-bold text-red-800" style={{ background: wash(VERMILION, "25") }}>
                  Avoid
                </span>
              );
            } else {
              statusBadge = (
                <span className="px-2 py-0.5 rounded text-xs font-bold text-amber-800" style={{ background: wash(GOLD, "25") }}>
                  Assess
                </span>
              );
            }

            return (
              <article
                key={c.key}
                style={{
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: "12px",
                  background: SURFACE,
                  padding: "0.9rem",
                  borderLeft: `4px solid ${c.color}`,
                }}
                className="flex flex-col gap-1"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                  <h4 style={{ margin: 0, color: c.color, fontSize: "0.95rem", fontWeight: 800 }}>
                    {c.name} <Devanagari size="sm">{c.devanagari}</Devanagari>
                  </h4>
                  {statusBadge}
                </div>
                <p style={{ margin: 0, fontSize: "0.78rem", color: INK_MUTED }}>
                  Members: {c.members.join(", ")}
                </p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.4, marginTop: "0.15rem" }}>
                  <strong>Affinities:</strong> {c.affinities.slice(0, 2).join("; ")}
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
   2. MANDALA TAB - Interactive SVG Mandala Wheel
   ══════════════════════════════════════════════════════════ */

function MandalaTab() {
  const [selectedNakIndex, setSelectedNakIndex] = useState<number>(7); // Default to Puṣya (index 7)
  const [filterMode, setFilterMode] = useState<"none" | "category" | "event">("none");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<CategoryKey | null>(null);
  const [activeEventFilter, setActiveEventFilter] = useState<EventTypeKey | null>(null);
  const [hoveredNakIndex, setHoveredNakIndex] = useState<number | null>(null);

  const selectedNak = NAKSHATRAS[selectedNakIndex];
  const selectedCat = getCategory(selectedNak.category)!;

  // Determine alignment/opacity for each sector based on active filters
  const getSectorStyle = (index: number) => {
    const nak = NAKSHATRAS[index];
    const cat = getCategory(nak.category)!;

    if (filterMode === "category" && activeCategoryFilter) {
      const isMatch = nak.category === activeCategoryFilter;
      return {
        fill: cat.color,
        opacity: isMatch ? 1.0 : 0.12,
        stroke: isMatch ? "#fff" : "rgba(255,255,255,0.15)",
        strokeWidth: isMatch ? 2 : 1,
      };
    }

    if (filterMode === "event" && activeEventFilter) {
      const event = getEventType(activeEventFilter)!;
      const isFavourable = event.favourableCategories.includes(nak.category);
      const isAvoid = event.avoidCategories.includes(nak.category);

      if (isFavourable) {
        return {
          fill: cat.color,
          opacity: 1.0,
          stroke: "#2F7D55",
          strokeWidth: 2,
        };
      } else if (isAvoid) {
        return {
          fill: "#A23A1E",
          opacity: 0.85,
          stroke: "#8B0000",
          strokeWidth: 2.5,
        };
      } else {
        return {
          fill: cat.color,
          opacity: 0.18,
          stroke: "rgba(255,255,255,0.2)",
          strokeWidth: 1,
        };
      }
    }

    // Default mode: no active filter
    const isHovered = hoveredNakIndex === index;
    const isSelected = selectedNakIndex === index;
    return {
      fill: cat.color,
      opacity: isSelected ? 1.0 : isHovered ? 0.9 : 0.72,
      stroke: isSelected ? "#fff" : isHovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.45)",
      strokeWidth: isSelected ? 3.5 : isHovered ? 2 : 1,
    };
  };

  const currentHoveredNak = hoveredNakIndex !== null ? NAKSHATRAS[hoveredNakIndex] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Mandala Dashboard & Controls */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {/* Interactive Filters Dashboard */}
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "16px",
            background: SURFACE,
            padding: "1.25rem",
          }}
          className="flex flex-col gap-3"
        >
          <div style={sectionLabelStyle}>Interactive Filters & Layers</div>
          
          <div className="flex flex-wrap gap-2 items-center">
            {/* Filter by Category Toggle */}
            <div style={{ fontSize: "0.8rem", fontWeight: 800, color: INK_SECONDARY }}>Filter Category:</div>
            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map((c) => {
                const isActive = filterMode === "category" && activeCategoryFilter === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => {
                      setFilterMode("category");
                      setActiveCategoryFilter(c.key);
                      setActiveEventFilter(null);
                    }}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg border transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: isActive ? c.color : HAIRLINE,
                      background: isActive ? c.color : "transparent",
                      color: isActive ? "#fff" : INK_SECONDARY,
                    }}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Filter by Event Toggle */}
            <div style={{ fontSize: "0.8rem", fontWeight: 800, color: INK_SECONDARY }}>Filter Event:</div>
            <div className="flex flex-wrap gap-1">
              {EVENT_TYPES.map((e) => {
                const isActive = filterMode === "event" && activeEventFilter === e.key;
                return (
                  <button
                    key={e.key}
                    type="button"
                    onClick={() => {
                      setFilterMode("event");
                      setActiveEventFilter(e.key);
                      setActiveCategoryFilter(null);
                    }}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg border transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: isActive ? TEAL : HAIRLINE,
                      background: isActive ? TEAL : "transparent",
                      color: isActive ? "#fff" : INK_SECONDARY,
                    }}
                  >
                    {e.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: INK_MUTED }}>
              {filterMode === "category" && "Showing only nakṣatras in selected category."}
              {filterMode === "event" && "Green = Favourable | Red = Avoid | Dimmed = Needs Context."}
              {filterMode === "none" && "Click a segment to inspect individual characteristics."}
            </span>
            {(filterMode !== "none" || activeCategoryFilter || activeEventFilter) && (
              <button
                type="button"
                onClick={() => {
                  setFilterMode("none");
                  setActiveCategoryFilter(null);
                  setActiveEventFilter(null);
                }}
                className="text-xs font-bold underline cursor-pointer"
                style={{ color: TEAL }}
              >
                Clear Filter
              </button>
            )}
          </div>
        </article>

        {/* SVG Mandala Visualizer */}
        <div className="flex justify-center items-center py-4" style={{ background: SURFACE_2, borderRadius: "16px", border: `1px solid ${HAIRLINE}` }}>
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
            style={{ maxWidth: WHEEL_SIZE, maxHeight: WHEEL_SIZE }}
          >
            {/* Outer space background circle */}
            <circle cx={WC} cy={WC} r={OUTER_R + 10} fill={wash(GOLD, "03")} stroke={HAIRLINE} strokeWidth={1} />
            <circle cx={WC} cy={WC} r={OUTER_R} fill="#fff" stroke={HAIRLINE} strokeWidth={1} />

            {/* 27 segments */}
            {NAKSHATRAS.map((n, i) => {
              const startAngle = i * WEDGE_ANGLE;
              const endAngle = (i + 1) * WEDGE_ANGLE;
              const midAngle = startAngle + WEDGE_ANGLE / 2;
              const path = arcPath(WC, WC, OUTER_R, INNER_R, startAngle, endAngle);
              const labelPos = polarToXY(WC, WC, LABEL_R, midAngle);
              
              // Upright orientation for radial text labels
              const textAngle = midAngle > 90 && midAngle < 270 ? midAngle + 180 : midAngle;
              const sectorStyle = getSectorStyle(i);

              return (
                <g
                  key={n.name}
                  onClick={() => setSelectedNakIndex(i)}
                  onMouseEnter={() => setHoveredNakIndex(i)}
                  onMouseLeave={() => setHoveredNakIndex(null)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Wedge sector */}
                  <path
                    d={path}
                    fill={sectorStyle.fill}
                    opacity={sectorStyle.opacity}
                    stroke={sectorStyle.stroke}
                    strokeWidth={sectorStyle.strokeWidth}
                    style={{ transition: "all 0.15s ease-out" }}
                  />

                  {/* Text label: Sector Index + Short Name */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    transform={`rotate(${textAngle}, ${labelPos.x}, ${labelPos.y})`}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={selectedNakIndex === i ? "#fff" : sectorStyle.opacity < 0.3 ? "rgba(0,0,0,0.15)" : "#fff"}
                    style={{
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      pointerEvents: "none",
                      letterSpacing: "-0.02em",
                      userSelect: "none",
                    }}
                  >
                    {`${i + 1}.${getShortName(n.name)}`}
                  </text>
                </g>
              );
            })}

            {/* Central Dashboard Compass Inner Disk */}
            <circle cx={WC} cy={WC} r={INNER_R - 5} fill={SURFACE} stroke={HAIRLINE} strokeWidth={2.5} />
            <circle cx={WC} cy={WC} r={INNER_R - 12} fill="#fff" opacity={0.6} />

            {/* Inner Dashboard Content */}
            <g transform={`translate(${WC}, ${WC})`}>
              {/* Display Hover state primary, otherwise Selected state */}
              {currentHoveredNak || selectedNak ? (
                (() => {
                  const targetNak = currentHoveredNak || selectedNak;
                  const targetIndex = NAKSHATRAS.findIndex((item) => item.name === targetNak.name);
                  const targetCat = getCategory(targetNak.category)!;
                  return (
                    <>
                      {/* Segment Index Indicator */}
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
                        {`Nakṣatra #${targetIndex + 1}`}
                      </text>

                      {/* Devanagari Name */}
                      <text
                        y="-22"
                        textAnchor="middle"
                        style={{
                          fontSize: "1.45rem",
                          fontWeight: 700,
                          fill: targetCat.color,
                          fontFamily: "var(--font-cormorant, Georgia, serif)",
                        }}
                      >
                        {targetNak.name}
                      </text>

                      {/* Category Badge Pill */}
                      <rect
                        x="-48"
                        y="2"
                        width="96"
                        height="18"
                        rx="9"
                        fill={wash(targetCat.color, "18")}
                        stroke={targetCat.color}
                        strokeWidth="1"
                      />
                      <text
                        y="14"
                        textAnchor="middle"
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 950,
                          fill: targetCat.color,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {targetCat.name}
                      </text>

                      {/* Meaning / Nature text */}
                      <text
                        y="38"
                        textAnchor="middle"
                        style={{
                          fontSize: "0.74rem",
                          fill: INK_SECONDARY,
                          fontWeight: 700,
                        }}
                      >
                        {targetCat.meaning}
                      </text>

                      <text
                        y="53"
                        textAnchor="middle"
                        style={{
                          fontSize: "0.65rem",
                          fill: INK_MUTED,
                          fontStyle: "italic",
                        }}
                      >
                        {currentHoveredNak ? "(Hovering segment)" : "(Selected segment)"}
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

      {/* Right Column: Dynamic Detail Panel */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* Selected Nakshatra dossier */}
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "16px",
            background: SURFACE,
            padding: "1.25rem",
            borderLeft: `5px solid ${selectedCat.color}`,
          }}
          className="flex flex-col gap-3.5"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "0.5rem", flexWrap: "wrap" }}>
            <div>
              <div style={eyebrowStyle}>Selected Stellar Mansion</div>
              <h3 style={{ margin: 0, color: selectedCat.color, fontSize: "1.4rem", fontFamily: "var(--font-cormorant, Georgia, serif)", fontWeight: 700 }}>
                {selectedNak.name}
              </h3>
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: wash(selectedCat.color, "18"), color: selectedCat.color, border: `1px solid ${selectedCat.color}` }}
            >
              {selectedCat.name}
            </span>
          </div>

          <div className="flex flex-col gap-2.5 text-sm" style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "0.85rem" }}>
            <div>
              <span style={{ color: INK_MUTED, fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Characteristic Nature
              </span>
              <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, fontWeight: 700 }}>{selectedCat.character}</p>
            </div>

            <div>
              <span style={{ color: INK_MUTED, fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Astronomical Position
              </span>
              <p style={{ margin: "0.1rem 0 0", color: INK_SECONDARY }}>
                Sector {selectedNakIndex + 1} of 27 segments of the zodiac orbit circle.
              </p>
            </div>

            {selectedNak.specialNote && (
              <div style={{ background: wash(GOLD, "0C"), borderLeft: `3px solid ${GOLD}`, padding: "0.5rem 0.65rem", borderRadius: "6px" }}>
                <span style={{ color: GOLD, fontWeight: 900, fontSize: "0.72rem", textTransform: "uppercase" }}>
                  Sūtra Exception Note
                </span>
                <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, fontSize: "0.78rem", lineHeight: 1.4 }}>{selectedNak.specialNote}</p>
              </div>
            )}

            <div>
              <span style={{ color: INK_MUTED, fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Auspicious Affinities
              </span>
              <ul className="list-disc pl-4 mt-1 flex flex-col gap-1 text-xs" style={{ color: INK_SECONDARY }}>
                {selectedCat.affinities.map((aff, i) => (
                  <li key={i}>{aff}</li>
                ))}
              </ul>
            </div>

            <div>
              <span style={{ color: INK_MUTED, fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Aversions & Exclusions
              </span>
              <ul className="list-disc pl-4 mt-1 flex flex-col gap-1 text-xs" style={{ color: INK_SECONDARY }}>
                {selectedCat.aversions.map((ave, i) => (
                  <li key={i}>{ave}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        {/* Legend Panel */}
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
          <div className="grid grid-cols-2 gap-2 text-xs">
            {CATEGORIES.map((c) => (
              <div key={c.key} className="flex items-center gap-1.5">
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.color }} />
                <span style={{ fontWeight: 800, color: INK_PRIMARY }}>{c.name}</span>
                <span style={{ color: INK_MUTED }}>({c.memberCount})</span>
              </div>
            ))}
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

  const handleScenarioChange = (index: number) => {
    setScenarioIndex(index);
    setSelectedIssue(null);
    setSelectedVerdict(null);
    setShowAnswer(false);
  };

  const isIssueCorrect = selectedIssue === scenario.expectedIssue;
  const isVerdictCorrect = selectedVerdict === scenario.expectedVerdict;
  const allCorrect = isIssueCorrect && isVerdictCorrect;

  return (
    <div className="flex flex-col gap-4">
      {/* Scenario Progress Indicators */}
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

      {/* Main Case Dossier Card */}
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
              <div style={{ fontSize: "0.68rem", color: INK_MUTED, fontWeight: 800, textTransform: "uppercase" }}>Moon Mansion</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 800, color: INK_PRIMARY, marginTop: "0.1rem" }}>{scenario.nakshatra}</div>
            </div>
            <div style={{ background: SURFACE_2, padding: "0.5rem", borderRadius: "8px", border: `1px solid ${HAIRLINE}`, textAlign: "center" }}>
              <div style={{ fontSize: "0.68rem", color: INK_MUTED, fontWeight: 800, textTransform: "uppercase" }}>Category</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 800, color: INK_PRIMARY, marginTop: "0.1rem" }}>
                {getCategory(scenario.category)?.name || scenario.category}
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

          {/* Diagnosis Diagnostic Inputs */}
          <div className="flex flex-col gap-3">
            <div>
              <div style={sectionLabelStyle} className="mb-2">1. Diagnose primary systemic issue:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ISSUE_OPTIONS.map((key) => {
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
            To avoid the single-limb-dominance failure mode, never select a date based solely on a favourable nakṣatra.
            Apply this step-by-step pipeline to integrate nakṣatras with the other limbs of the pañcāṅga.
          </p>
        </article>

        <div className="flex flex-col gap-2.5">
          {INTEGRATION_STEPS.map((step, idx) => {
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
              <Devanagari size="md">चर-स्थिर-उग्र-मृदु-तीक्ष्ण-मिश्र-लघु-संज्ञकाः।</Devanagari>
              <Devanagari size="md">सप्तविधाः स्मृताः तारा नक्षत्राः मुहूर्तके॥</Devanagari>
            </div>
            <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "0.5rem" }}>
              <IAST size="sm">
                cara-sthira-ugra-mṛdu-tīkṣṇa-miśra-laghu-saṁjñakāḥ | sapta-vidhāḥ smṛtāḥ tāra nakṣatrāḥ muhūrtake ||
              </IAST>
            </div>
          </div>

          <div className="text-xs flex flex-col gap-2 text-justify" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <p style={{ margin: 0 }}>
              <strong>Translation:</strong> "Designated as movable, fixed, fierce, mild, sharp, mixed, and light — the nakṣatras are remembered as seven-categorised for muhūrta-purposes."
            </p>
            <p style={{ margin: 0, fontStyle: "italic", color: INK_MUTED }}>
              — Muhūrta-Cintāmaṇi, Chapter 3
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
              { label: "3. Nakṣatra (Selected Mansion)", active: true },
              { label: "4. Yoga", active: false },
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
