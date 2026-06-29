"use client";

import { useState, useMemo } from "react";
import {
  Compass,
  BookOpen,
  Briefcase,
  Sparkles,
  Heart,
  Baby,
  Home,
  GraduationCap,
  Award,
  Shield,
  AlertTriangle,
  History,
  Info,
  Layers,
  ArrowRight,
  Zap,
  CheckCircle,
  HelpCircle
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A44135";
const PURPLE = "#6D28D9";
const ORANGE = "#C2410C";

// Varga specification including name, divisions (n), domain, category, and exceptions.
interface VargaData {
  d: number;
  name: string;
  n: number;
  domain: string;
  category: "primary" | "social" | "spiritual";
  unequal?: number[];
  rulers?: string[];
  description: string;
}

const VARGAS: VargaData[] = [
  {
    d: 1,
    name: "Rāśi",
    n: 1,
    domain: "Whole Life & Body",
    category: "primary",
    description: "The primary horoscope. It represents the macroscopic view of life, physical body structure, and overall trajectory. All other charts are derived from this master template.",
  },
  {
    d: 2,
    name: "Horā",
    n: 2,
    domain: "Wealth & Resources",
    category: "social",
    description: "Splits each sign into two halves (ruled by Sun/Moon). Focuses specifically on liquid wealth, resource accumulation, family values, and financial stability.",
  },
  {
    d: 3,
    name: "Drekkāṇa",
    n: 3,
    domain: "Siblings & Courage",
    category: "social",
    description: "Subdivides signs into three parts of 10° each. Represents siblings, courage, physical energy, motivation, initiative, and short journeys.",
  },
  {
    d: 4,
    name: "Chaturthāṁśa",
    n: 4,
    domain: "Property & Home",
    category: "social",
    description: "Four divisions of 7°30′ each. Governs fixed assets, real estate, property, domestic happiness, home environment, and emotional security.",
  },
  {
    d: 7,
    name: "Saptāṁśa",
    n: 7,
    domain: "Children & Progeny",
    category: "social",
    description: "Seven equal divisions of 4°17′. Represents children, grandchildren, progeny, creative projects, and the expansion of the family tree.",
  },
  {
    d: 9,
    name: "Navāṁśa",
    n: 9,
    domain: "Marriage & Inner Dharma",
    category: "primary",
    description: "The prototype varga (9 divisions of 3°20′). It reveals the inner potential, deeper planetary strength, marriage, spiritual partner, and aligned path of dharma.",
  },
  {
    d: 10,
    name: "Daśāṁśa",
    n: 10,
    domain: "Career & Status",
    category: "primary",
    description: "Ten equal divisions of 3°. Focuses purely on career, profession, status in society, achievements, leadership capability, and actions in the outer world.",
  },
  {
    d: 12,
    name: "Dvādaśāṁśa",
    n: 12,
    domain: "Parents & Lineage",
    category: "social",
    description: "Twelve equal divisions of 2°30′. Reveals ancestral roots, genetics, maternal and paternal lineages, and relationships with parents.",
  },
  {
    d: 16,
    name: "Ṣoḍaśāṁśa",
    n: 16,
    domain: "Vehicles & Comforts",
    category: "social",
    description: "Sixteen divisions of 1°52.5′. Governs vehicles, conveyances, physical comforts, luxuries, and the sensory happiness derived from material objects.",
  },
  {
    d: 20,
    name: "Viṁśāṁśa",
    n: 20,
    domain: "Spirituality & Devotion",
    category: "spiritual",
    description: "Twenty divisions of 1°30′. Focuses on spiritual practices, meditation, religious inclination, mantra sādhanā, gurus, and internal spiritual growth.",
  },
  {
    d: 24,
    name: "Chaturviṁśāṁśa",
    n: 24,
    domain: "Education & Learning",
    category: "spiritual",
    description: "Twenty-four divisions of 1°15′. Maps academic intelligence, higher education, research capabilities, and the capacity to absorb knowledge.",
  },
  {
    d: 27,
    name: "Saptaviṁśāṁśa",
    n: 27,
    domain: "Strengths & Weaknesses",
    category: "spiritual",
    description: "Twenty-seven divisions of 1°06.6′. Also known as Bhāṁśa. It analyzes physical stamina, underlying nervous strengths, weaknesses, and temperament.",
  },
  {
    d: 30,
    name: "Triṁśāṁśa",
    n: 5,
    domain: "Misfortunes & Obstacles",
    category: "spiritual",
    unequal: [5, 5, 8, 7, 5],
    rulers: ["Mars ♂", "Saturn ♄", "Jupiter ♃", "Mercury ☿", "Venus ♀"],
    description: "The exceptional varga representing misfortunes, evils, chronic illnesses, and deep subconscious fears. It has 5 unequal divisions ruled by non-luminary planets.",
  },
  {
    d: 40,
    name: "Khavedāṁśa",
    n: 40,
    domain: "Maternal Lineage & Auspiciousness",
    category: "spiritual",
    description: "Forty divisions of 45′ each. Details maternal lineage, maternal family blessings, and overall auspicious events or traits carried through heritage.",
  },
  {
    d: 45,
    name: "Akṣavedāṁśa",
    n: 45,
    domain: "Paternal Lineage & Conduct",
    category: "spiritual",
    description: "Forty-five divisions of 40′ each. Details paternal heritage, general moral conduct, character stability, and inherited ethical qualities.",
  },
  {
    d: 60,
    name: "Ṣaṣṭyāṁśa",
    n: 60,
    domain: "Karmic Substrate",
    category: "spiritual",
    description: "Sixty divisions of 30′ each. The deepest divisional chart representing accumulated past life karma, showing why specific outcomes unfold in the D1.",
  },
];

// Helper mapping to icons depending on the domain
function getVargaIcon(d: number) {
  switch (d) {
    case 1:
      return <Layers className="w-5 h-5" style={{ color: GOLD }} />;
    case 2:
      return <Award className="w-5 h-5" style={{ color: GOLD }} />;
    case 3:
      return <Compass className="w-5 h-5" style={{ color: GOLD }} />;
    case 4:
      return <Home className="w-5 h-5" style={{ color: GOLD }} />;
    case 7:
      return <Baby className="w-5 h-5" style={{ color: GOLD }} />;
    case 9:
      return <Heart className="w-5 h-5" style={{ color: GOLD }} />;
    case 10:
      return <Briefcase className="w-5 h-5" style={{ color: GOLD }} />;
    case 12:
      return <History className="w-5 h-5" style={{ color: GOLD }} />;
    case 16:
      return <Award className="w-5 h-5" style={{ color: GOLD }} />;
    case 20:
      return <Sparkles className="w-5 h-5" style={{ color: GOLD }} />;
    case 24:
      return <GraduationCap className="w-5 h-5" style={{ color: GOLD }} />;
    case 30:
      return <AlertTriangle className="w-5 h-5" style={{ color: RED }} />;
    default:
      return <Shield className="w-5 h-5" style={{ color: GOLD }} />;
  }
}

// Router Questions
interface RoutingQuestion {
  question: string;
  varga: number;
  rationale: string;
}

const ROUTER_QUESTIONS: RoutingQuestion[] = [
  {
    question: "What is my spouse's temperament, and how will my marriage unfold?",
    varga: 9,
    rationale: "By classical standard, marriage and relationship depth cannot be answered from the D1 alone. The Navāṁśa (D9) acts as a microscopic lens specifically designed to evaluate your marital destiny, spouse profile, and core dharma.",
  },
  {
    question: "What career paths suit me best, and how will I gain social status?",
    varga: 10,
    rationale: "While D1 shows general opportunities, the Daśāṁśa (D10) isolates career, occupation, leadership, and public influence. Real profession readings check the D10 first to find planetary capacity in action.",
  },
  {
    question: "Will I have children, and what will my progeny's life be like?",
    varga: 7,
    rationale: "The Saptāṁśa (D7) zooms in on fertility, progeny, relationship with children, and overall creative legacy. It refines the fifth house promise of the D1 chart.",
  },
  {
    question: "Will I be able to buy land, build a house, or buy a vehicle?",
    varga: 4,
    rationale: "The Chaturthāṁśa (D4) isolates the parameters of home life, real estate, property ownership, fixed assets, and basic domestic contentment.",
  },
  {
    question: "What deep subconscious spiritual strengths or guru lineages do I align with?",
    varga: 20,
    rationale: "The Viṁśāṁśa (D20) is dedicated to spiritual accomplishments, religious practice, level of devotion, and progress in meditation, separate from worldly achievements.",
  },
  {
    question: "What chronic diseases, sudden obstacles, or major misfortunes lie in my chart?",
    varga: 30,
    rationale: "The Triṁśāṁśa (D30) acts as the alarm system. It isolates challenges, diseases, debts, and enemies. Its unequal segments map specific types of vulnerability.",
  },
  {
    question: "What is the ultimate karmic background and past life actions carrying over?",
    varga: 60,
    rationale: "The Ṣaṣṭyāṁśa (D60) is the highest-magnification lens (60 divisions of 30′). Parāśara grants it immense weight, as it shows the foundational karmic substrate of the soul.",
  },
];

export function VargaExplainer() {
  const [vargaIndex, setVargaIndex] = useState(5); // Default to D9 Navāṁśa
  const [deg, setDeg] = useState(8.5); // Degree in Sign
  const [activeTab, setActiveTab] = useState<"explorer" | "directory" | "router">("explorer");
  const [directoryFilter, setDirectoryFilter] = useState<"all" | "primary" | "social" | "spiritual">("all");
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  const activeVarga = VARGAS[vargaIndex];

  // Calculation of widths and active sector boundaries
  const widths = useMemo(() => {
    if (activeVarga.unequal) {
      return [...activeVarga.unequal];
    }
    return Array.from({ length: activeVarga.n }, () => 30 / activeVarga.n);
  }, [activeVarga]);

  const { activePart, partStart, partEnd } = useMemo(() => {
    let acc = 0;
    let foundPart = 1;
    let startDeg = 0;
    let endDeg = 30;

    for (let i = 0; i < widths.length; i++) {
      const w = widths[i];
      const nextAcc = acc + w;
      if (deg >= acc && deg < nextAcc) {
        foundPart = i + 1;
        startDeg = acc;
        endDeg = nextAcc;
        break;
      }
      acc = nextAcc;
    }

    // Fallback boundary handling
    if (deg >= 30) {
      foundPart = widths.length;
      startDeg = 30 - widths[widths.length - 1];
      endDeg = 30;
    }

    return {
      activePart: foundPart,
      partStart: startDeg,
      partEnd: endDeg,
    };
  }, [widths, deg]);

  // Load a varga directly from the list or router
  const loadVarga = (dNumber: number, tabToGo: "explorer" | "router" = "explorer") => {
    const idx = VARGAS.findIndex((vv) => vv.d === dNumber);
    if (idx !== -1) {
      setVargaIndex(idx);
      setActiveTab(tabToGo);
    }
  };

  const filteredVargas = useMemo(() => {
    if (directoryFilter === "all") return VARGAS;
    return VARGAS.filter((vv) => vv.category === directoryFilter);
  }, [directoryFilter]);

  const activeQuestion = ROUTER_QUESTIONS[activeQuestionIdx];

  return (
    <div
      data-interactive="varga-explainer"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
        color: INK_PRIMARY,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Tab Navigation header */}
      <div
        style={{
          display: "flex",
          borderBottom: `2px solid ${HAIRLINE}`,
          gap: "0.5rem",
          paddingBottom: "2px",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("explorer")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "explorer" ? `3px solid ${GOLD}` : "3px solid transparent",
            color: activeTab === "explorer" ? GOLD : INK_SECONDARY,
            padding: "0.5rem 1rem",
            fontSize: "0.88rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            transition: "all 0.2s ease",
          }}
        >
          <Compass className="w-4 h-4" />
          Division Explorer
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("directory")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "directory" ? `3px solid ${GOLD}` : "3px solid transparent",
            color: activeTab === "directory" ? GOLD : INK_SECONDARY,
            padding: "0.5rem 1rem",
            fontSize: "0.88rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            transition: "all 0.2s ease",
          }}
        >
          <BookOpen className="w-4 h-4" />
          Ṣoḍaśavarga Directory
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("router")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "router" ? `3px solid ${GOLD}` : "3px solid transparent",
            color: activeTab === "router" ? GOLD : INK_SECONDARY,
            padding: "0.5rem 1rem",
            fontSize: "0.88rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            transition: "all 0.2s ease",
          }}
        >
          <Zap className="w-4 h-4" />
          Domain Router
        </button>
      </div>

      {/* Main Tab Rendering */}
      {activeTab === "explorer" && (
        <div style={{ display: "grid", gap: "1.2rem" }}>
          {/* Top Panel: Settings and Selectors */}
          <section
            style={{
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 12,
              background: SURFACE,
              padding: "1.25rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <p
                  style={{
                    margin: 0,
                    color: GOLD,
                    fontSize: "0.78rem",
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Active Division
                </p>
                <h2 style={{ margin: "0.2rem 0 0", color: INK_PRIMARY, fontSize: "1.4rem", fontWeight: 800 }}>
                  D{activeVarga.d} · {activeVarga.name}
                </h2>
              </div>
              <span
                style={{
                  background: activeVarga.category === "primary" ? "#FEF3C7" : activeVarga.category === "social" ? "#D1FAE5" : "#F3E8FF",
                  color: activeVarga.category === "primary" ? "#92400E" : activeVarga.category === "social" ? "#065F46" : "#6B21A8",
                  padding: "0.25rem 0.6rem",
                  borderRadius: 20,
                  fontSize: "0.74rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                {activeVarga.category}
              </span>
            </div>

            <p style={{ margin: "0.6rem 0 1.2rem", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>
              A rāśi is 30° wide. Below, see how D{activeVarga.d} slices this space. Move the slider to shift the planet's degree.
            </p>

            {/* Varga Quick Select Row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1.2rem" }}>
              {VARGAS.map((vv, i) => (
                <button
                  key={vv.d}
                  type="button"
                  onClick={() => setVargaIndex(i)}
                  style={{
                    border: `1px solid ${vargaIndex === i ? GOLD : HAIRLINE}`,
                    borderRadius: 6,
                    background: vargaIndex === i ? GOLD : "transparent",
                    color: vargaIndex === i ? "#fff" : INK_SECONDARY,
                    padding: "0.3rem 0.6rem",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  D{vv.d}
                </button>
              ))}
            </div>

            {/* Planet Degree Controller */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                flexWrap: "wrap",
                background: "rgba(156, 122, 47, 0.05)",
                padding: "0.8rem 1rem",
                borderRadius: 8,
                border: `1px solid ${HAIRLINE}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ color: GOLD, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Planet Position
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={29.99}
                step={0.01}
                value={deg}
                onChange={(e) => setDeg(Number(e.target.value))}
                style={{ accentColor: GOLD, flex: 1, minWidth: "10rem", cursor: "ew-resize" }}
              />
              <div style={{ minWidth: "4.5rem", textAlign: "right" }}>
                <strong style={{ color: GOLD, fontSize: "1.1rem" }}>{deg.toFixed(2)}°</strong>
              </div>
            </div>
          </section>

          {/* Interactive SVG Ruler visualization */}
          <section
            style={{
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 12,
              background: SURFACE,
              padding: "1.25rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.6rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase" }}>
                Rāśi Subdivision Visualizer (30°)
              </span>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: GOLD }}>
                {activeVarga.unequal
                  ? "5 Unequal Segments"
                  : `${activeVarga.n} equal parts of ${(30 / activeVarga.n).toFixed(2).replace(/\.00$/, "")}°`}
              </span>
            </div>

            {/* SVG Ruler Segment */}
            <div style={{ position: "relative", width: "100%", height: "85px", background: "#FAF7F2", borderRadius: 8, border: `1px solid ${HAIRLINE}`, overflow: "hidden" }}>
              <svg width="100%" height="100%" style={{ display: "block" }}>
                {/* 1-degree tick marks */}
                {Array.from({ length: 31 }).map((_, i) => {
                  const isMajor = i % 5 === 0;
                  const xPct = `${(i / 30) * 100}%`;
                  return (
                    <line
                      key={i}
                      x1={xPct}
                      y1="0"
                      x2={xPct}
                      y2={isMajor ? "16" : "8"}
                      stroke={HAIRLINE}
                      strokeWidth={isMajor ? 1.5 : 0.8}
                    />
                  );
                })}

                {/* Subdivisions mapping */}
                {widths.map((w, i) => {
                  // Compute accumulated starting coordinate percentage
                  const startSum = widths.slice(0, i).reduce((a, b) => a + b, 0);
                  const startPct = `${(startSum / 30) * 100}%`;
                  const widthPct = `${(w / 30) * 100}%`;
                  const isCurrent = i + 1 === activePart;

                  return (
                    <g key={i}>
                      {/* Interactive click segment area */}
                      <rect
                        x={startPct}
                        y="18"
                        width={widthPct}
                        height="45"
                        fill={isCurrent ? "rgba(156, 122, 47, 0.15)" : "transparent"}
                        stroke={HAIRLINE}
                        strokeWidth="1"
                        style={{ cursor: "pointer", transition: "fill 0.2s ease" }}
                        onClick={() => {
                          const midpoint = startSum + w / 2;
                          setDeg(Number(midpoint.toFixed(2)));
                        }}
                      />
                      {/* Label for sector */}
                      <text
                        x={`${((startSum + w / 2) / 30) * 100}%`}
                        y="46"
                        textAnchor="middle"
                        fill={isCurrent ? GOLD : INK_MUTED}
                        style={{
                          fontSize: activeVarga.n > 20 ? "0.5rem" : "0.7rem",
                          fontWeight: isCurrent ? 900 : 600,
                          pointerEvents: "none",
                        }}
                      >
                        {activeVarga.unequal
                          ? activeVarga.rulers?.[i].split(" ")[0]
                          : activeVarga.n <= 16
                          ? i + 1
                          : ""}
                      </text>
                    </g>
                  );
                })}

                {/* Planet cursor line indicator */}
                <line
                  x1={`${(deg / 30) * 100}%`}
                  y1="0"
                  x2={`${(deg / 30) * 100}%`}
                  y2="63"
                  stroke={GOLD}
                  strokeWidth="2.5"
                  strokeDasharray="1 1"
                />

                {/* Planet marker pin */}
                <circle
                  cx={`${(deg / 30) * 100}%`}
                  cy="63"
                  r="5.5"
                  fill={GOLD}
                  stroke="#FFF"
                  strokeWidth="1.5"
                  style={{ filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.2))" }}
                />
              </svg>

              {/* Bottom bounds labels */}
              <div
                style={{
                  position: "absolute",
                  bottom: "3px",
                  left: "6px",
                  right: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.68rem",
                  color: INK_MUTED,
                  fontWeight: 700,
                  pointerEvents: "none",
                }}
              >
                <span>0°</span>
                <span>15° Midpoint</span>
                <span>30°</span>
              </div>
            </div>

            {/* Click explanation hint */}
            <p style={{ margin: "0.4rem 0 0", color: INK_MUTED, fontSize: "0.72rem", textAlign: "center", fontStyle: "italic" }}>
              Tip: Click directly on a sector block inside the visualizer to place the planet in that division.
            </p>
          </section>

          {/* Zoom lens double-card metaphor */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.2rem" }}>
            {/* Metaphor Left: D1 Macroscopic overview */}
            <div
              style={{
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 12,
                background: SURFACE,
                padding: "1.2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GOLD, marginBottom: "0.4rem" }}>
                  <Layers className="w-4 h-4" />
                  <span style={{ fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    D1 Macroscopic View
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>Whole Rāśi Sign Context</h3>
                <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                  The planet occupies this sign as a single 30° entity. Under the macroscopic lens, it provides the general landscape for the whole life.
                </p>
              </div>

              <div
                style={{
                  background: "rgba(156, 122, 47, 0.03)",
                  borderLeft: `3.5px solid ${HAIRLINE}`,
                  padding: "0.6rem 0.8rem",
                  borderRadius: "0 8px 8px 0",
                  marginTop: "1rem",
                }}
              >
                <span style={{ fontSize: "0.8rem", color: INK_MUTED, display: "block" }}>Planet Degree</span>
                <strong style={{ fontSize: "1.1rem", color: GOLD }}>{deg.toFixed(2)}°</strong>
                <span style={{ display: "block", fontSize: "0.74rem", color: INK_SECONDARY, marginTop: "0.15rem" }}>
                  Inside sign boundary (0° to 30°)
                </span>
              </div>
            </div>

            {/* Metaphor Right: Dn Magnification Chamber */}
            <div
              style={{
                border: `2px solid ${GOLD}`,
                borderRadius: 12,
                background: SURFACE,
                padding: "1.2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 10px 15px -3px rgba(156, 122, 47, 0.08)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GOLD, marginBottom: "0.4rem" }}>
                  <Compass className="w-4 h-4" />
                  <span style={{ fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    D{activeVarga.d} Magnified Sector
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>
                  Sector {activePart} of {activeVarga.n}
                </h3>
                <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                  {activeVarga.unequal ? (
                    <>
                      At {deg.toFixed(2)}°, the planet lands in the unequal sector from{" "}
                      <strong>
                        {partStart}° to {partEnd}°
                      </strong>
                      , ruled by <strong>{activeVarga.rulers?.[activePart - 1]}</strong>.
                    </>
                  ) : (
                    <>
                      At {deg.toFixed(2)}°, the planet lands in division {activePart} (spanning{" "}
                      <strong>
                        {partStart.toFixed(2)}° to {partEnd.toFixed(2)}°
                      </strong>
                      ).
                    </>
                  )}
                </p>
              </div>

              <div
                style={{
                  background: "rgba(47, 125, 85, 0.06)",
                  borderLeft: `3.5px solid ${activeVarga.d === 30 ? RED : GREEN}`,
                  padding: "0.6rem 0.8rem",
                  borderRadius: "0 8px 8px 0",
                  marginTop: "1rem",
                }}
              >
                <span style={{ fontSize: "0.74rem", color: INK_MUTED, display: "block", textTransform: "uppercase", fontWeight: 700 }}>
                  Magnified Life Domain:
                </span>
                <strong style={{ fontSize: "0.94rem", color: activeVarga.d === 30 ? RED : GREEN, display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.15rem" }}>
                  {getVargaIcon(activeVarga.d)}
                  {activeVarga.domain}
                </strong>
                <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.78rem" }}>
                  Performance in this sub-sector determines outcomes for this domain.
                </p>
              </div>
            </div>
          </div>

          {/* Triṁśāṁśa alert warning details */}
          {activeVarga.d === 30 && (
            <div
              style={{
                background: "rgba(164, 65, 53, 0.05)",
                border: `1px solid ${RED}`,
                borderRadius: 10,
                padding: "1rem",
                display: "flex",
                gap: "0.8rem",
                alignItems: "flex-start",
              }}
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: RED, marginTop: "0.1rem" }} />
              <div>
                <h4 style={{ margin: 0, color: RED, fontWeight: 800, fontSize: "0.9rem" }}>
                  Triṁśāṁśa (D30) Crucial Exception Warning
                </h4>
                <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.45 }}>
                  Unlike standard divisional charts, <strong>D30 does not split signs into 30 equal parts</strong>. Parāśara defines it as
                  five unequal sectors of <strong>5°, 5°, 8°, 7°, and 5°</strong>. Rulers are restricted to non-luminary planets representing specific categories of obstacles and subconscious blockages.
                </p>
              </div>
            </div>
          )}

          {/* Bottom Metaphor Context */}
          <div
            style={{
              background: "rgba(156, 122, 47, 0.03)",
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 8,
              padding: "0.8rem 1rem",
              fontSize: "0.78rem",
              color: INK_MUTED,
              lineHeight: 1.4,
              textAlign: "center",
            }}
          >
            <strong>Pedagogical Reminder:</strong> A varga chart is a derived lens on the <em>same birth chart</em>, not an independent
            horoscope. We read D1 first to get the macroscopic context, then look at the relevant Dn for high-resolution confirmation.
          </div>
        </div>
      )}

      {/* Directory Tab */}
      {activeTab === "directory" && (
        <div style={{ display: "grid", gap: "1rem" }}>
          <section
            style={{
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 12,
              background: SURFACE,
              padding: "1.25rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>The Ṣoḍaśavarga Directory</h3>
            <p style={{ margin: "0.2rem 0 0.8rem", color: INK_SECONDARY, fontSize: "0.85rem" }}>
              Parāśara's 16 division charts grouped by life-domain categorization. Click any card to select it for explorer analysis.
            </p>

            {/* Filter pills */}
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.6rem" }}>
              {[
                { key: "all", label: "All 16" },
                { key: "primary", label: "Primary (D1, D9, D10)" },
                { key: "social", label: "Physical & Social" },
                { key: "spiritual", label: "Spiritual & Karmic" },
              ].map((pill) => (
                <button
                  key={pill.key}
                  type="button"
                  onClick={() => setDirectoryFilter(pill.key as any)}
                  style={{
                    background: directoryFilter === pill.key ? GOLD : "transparent",
                    color: directoryFilter === pill.key ? "#fff" : INK_SECONDARY,
                    border: `1px solid ${directoryFilter === pill.key ? GOLD : HAIRLINE}`,
                    borderRadius: 20,
                    padding: "0.25rem 0.65rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Vargas Grid list */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.8rem", marginTop: "1rem" }}>
              {filteredVargas.map((vv) => {
                const isSelected = activeVarga.d === vv.d;
                return (
                  <div
                    key={vv.d}
                    onClick={() => loadVarga(vv.d, "explorer")}
                    style={{
                      border: isSelected ? `2.5px solid ${GOLD}` : `1px solid ${HAIRLINE}`,
                      borderRadius: 10,
                      background: SURFACE,
                      padding: "0.9rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: isSelected ? "0 4px 12px rgba(156,122,47,0.12)" : "none",
                      position: "relative",
                      transform: isSelected ? "scale(1.02)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "1.1rem", fontWeight: 900, color: GOLD }}>D{vv.d}</span>
                      {getVargaIcon(vv.d)}
                    </div>
                    <h4 style={{ margin: "0.3rem 0 0.15rem", fontWeight: 800, fontSize: "0.95rem" }}>{vv.name}</h4>
                    <p style={{ margin: 0, fontSize: "0.74rem", fontWeight: 700, color: GREEN, textTransform: "uppercase" }}>
                      {vv.domain}
                    </p>
                    <p style={{ margin: "0.4rem 0 0", fontSize: "0.76rem", color: INK_SECONDARY, lineHeight: 1.4 }}>
                      {vv.description.substring(0, 85)}...
                    </p>

                    {isSelected && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "6px",
                          right: "6px",
                          fontSize: "0.6rem",
                          fontWeight: 900,
                          color: GOLD,
                          textTransform: "uppercase",
                        }}
                      >
                        Active in Explorer
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* Domain Router Tab */}
      {activeTab === "router" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.2rem",
          }}
        >
          {/* Question panel */}
          <section
            style={{
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 12,
              background: SURFACE,
              padding: "1.25rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            }}
          >
            <h3 style={{ margin: "0 0 0.8rem", fontSize: "1.05rem", fontWeight: 800 }}>Ask a life question:</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {ROUTER_QUESTIONS.map((q, idx) => {
                const isActive = activeQuestionIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveQuestionIdx(idx)}
                    style={{
                      border: `1px solid ${isActive ? GOLD : HAIRLINE}`,
                      borderRadius: 8,
                      background: isActive ? "rgba(156,122,47,0.05)" : "transparent",
                      color: isActive ? GOLD : INK_PRIMARY,
                      padding: "0.75rem 0.9rem",
                      fontSize: "0.82rem",
                      textAlign: "left",
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <span>{q.question}</span>
                    <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? GOLD : INK_MUTED }} />
                  </button>
                );
              })}
            </div>
          </section>

          {/* Routing Result panel */}
          <section
            style={{
              border: `2px solid ${GOLD}`,
              borderRadius: 12,
              background: SURFACE,
              padding: "1.25rem",
              boxShadow: "0 10px 15px -3px rgba(156, 122, 47, 0.08)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GOLD, marginBottom: "0.6rem" }}>
                <Zap className="w-4 h-4 text-amber-500" />
                <span style={{ fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Routing Engine Resolved
                </span>
              </div>

              <div
                style={{
                  background: "#FAF7F2",
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: 8,
                  padding: "0.65rem 0.8rem",
                  fontSize: "0.78rem",
                  color: INK_SECONDARY,
                  marginBottom: "1rem",
                }}
              >
                Query: <span style={{ fontStyle: "italic", color: INK_PRIMARY }}>&ldquo;{activeQuestion.question}&rdquo;</span>
              </div>

              {/* Destination Varga Card */}
              {(() => {
                const destVarga = VARGAS.find((v) => v.d === activeQuestion.varga);
                if (!destVarga) return null;
                return (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                      <div
                        style={{
                          background: GOLD,
                          color: "#FFF",
                          width: "2.2rem",
                          height: "2.2rem",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.1rem",
                          fontWeight: 900,
                        }}
                      >
                        D{destVarga.d}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>{destVarga.name}</h4>
                        <span style={{ color: GREEN, fontSize: "0.74rem", fontWeight: 800, textTransform: "uppercase" }}>
                          {destVarga.domain}
                        </span>
                      </div>
                    </div>

                    <p style={{ margin: "0.8rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>
                      {activeQuestion.rationale}
                    </p>
                  </div>
                );
              })()}
            </div>

            <button
              type="button"
              onClick={() => loadVarga(activeQuestion.varga, "explorer")}
              style={{
                width: "100%",
                background: GOLD,
                color: "#FFF",
                border: "none",
                borderRadius: 8,
                padding: "0.65rem",
                fontSize: "0.88rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                marginTop: "1.5rem",
                boxShadow: "0 4px 6px rgba(156,122,47,0.15)",
                transition: "all 0.15s ease",
              }}
            >
              <Compass className="w-4 h-4" />
              Load Varga D{activeQuestion.varga} into Explorer
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
