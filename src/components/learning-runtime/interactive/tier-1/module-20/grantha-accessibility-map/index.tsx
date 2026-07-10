"use client";

import { useState } from "react";
import { HelpCircle, RefreshCw, CheckCircle2, AlertTriangle, BookOpen, Info, Sparkles, BookOpenCheck } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_LIGHT = "rgba(156, 122, 47, 0.08)";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";

interface Grantha {
  id: string;
  name: string;
  short: string;
  correctTier: string;
  desc: string;
  detail: string;
}

const GRANTHAS: Grantha[] = [
  {
    id: "bhrigu",
    name: "Bhṛgu Saṁhitā",
    short: "BH",
    correctTier: "highly-active",
    desc: "Active North-Indian reading centre.",
    detail: "Centred primarily at Hoshiarpur (Punjab). Features vast physical libraries of loose manuscript folios representing a highly active living consultation practice."
  },
  {
    id: "agastya",
    name: "Agastya Nāḍī",
    short: "AG",
    correctTier: "highly-active",
    desc: "Hub of South-Indian Tamil Nāḍī.",
    detail: "Centred at Vaitheeswarankoil (Tamil Nadu) with multiple families holding leaf collections. Highly active living practice utilizing thumbprint-based retrieval."
  },
  {
    id: "devakeralam",
    name: "Devakeralam",
    short: "DK",
    correctTier: "published",
    desc: "Teachable rules-based framework.",
    detail: "A medieval predictive framework (~14th century) compiled by Acyutānanda. Unlike pre-recorded life manuscript bundles, it is a verse-by-verse rules-based system. It has been printed and translated (Santhanam), making it the only genuinely teachable Nāḍī text."
  },
  {
    id: "saptarshi",
    name: "Saptarṣi Nāḍī",
    short: "SR",
    correctTier: "major-less-central",
    desc: "Seven sages Tamil collection.",
    detail: "Attributed to the seven sages collectively. Attested in Tamil collections, but operating on a distinct multi-sage dialogue structure, less central than Agastya in active practice."
  },
  {
    id: "sivavak",
    name: "Śiva-Vāk Nāḍī",
    short: "SV",
    correctTier: "major-less-central",
    desc: "Lord Shiva's speech sub-lineage.",
    detail: "Direct-revelation framing attributing its leaves to Shiva's own speech. A major Vaitheeswarankoil sub-lineage sharing the same material footing and Tamil narrative style."
  },
  {
    id: "kerala",
    name: "Kerala Lineages",
    short: "KL",
    correctTier: "fragmented",
    desc: "Private regional families.",
    detail: "Fragmented living traditions preserved by private regional families in Kerala. They do not operate massive public centres but represent active, localized lineages."
  },
  {
    id: "dhruva",
    name: "Dhruva Nāḍī",
    short: "DH",
    correctTier: "attested-rare",
    desc: "Attested, rarely encountered.",
    detail: "Attested in classical Sanskrit literature and name-lists (e.g., Satyācārya references) but rarely encountered in documented modern practice. Treat with epistemic humility."
  },
  {
    id: "vasistha",
    name: "Vasiṣṭha Nāḍī",
    short: "VS",
    correctTier: "attested-rare",
    desc: "Attested, rarely encountered.",
    detail: "Attested in name-lists as an ancient sage-Nāḍī, but does not have documented active centers. Acknowledging it exists in theory but not fabricating center locations is the honest stance."
  }
];

const TIERS = [
  { id: "highly-active", label: "Highly Active", sub: "Large-scale active hubs" },
  { id: "published", label: "Published Framework", sub: "Rules in print (teachable)" },
  { id: "major-less-central", label: "Major / Less-Central", sub: "Attested secondary lines" },
  { id: "fragmented", label: "Fragmented Living", sub: "Private family lineages" },
  { id: "attested-rare", label: "Attested / Rare", sub: "Literature only, rare practice" }
];

interface DojoScenario {
  id: string;
  title: string;
  question: string;
  choices: {
    text: string;
    type: "mystification" | "balanced" | "scoffing";
    feedback: string;
  }[];
}

const DOJO_SCENARIOS: DojoScenario[] = [
  {
    id: "sc-1",
    title: "Scenario 1: The 'Can I Learn It?' Query",
    question: "A learner asks: 'I want to enroll in the Grahvani course to learn how to read palm leaves and consult Bhṛgu manuscripts directly. Can I master this in Tier 1?' How do you respond?",
    choices: [
      {
        text: "Yes, our course teaches direct palm-leaf reading competence for Agastya and Bhṛgu Saṁhitā.",
        type: "mystification",
        feedback: "Incorrect. Directly reading lineage-locked manuscripts requires family apprenticeship. We cannot teach direct manuscript reading competency."
      },
      {
        text: "No, direct manuscript reading requires family-lineage apprenticeship. However, you can study the published rules-based predictive framework of Devakeralam, and learn general literacy about the others.",
        type: "balanced",
        feedback: "Correct! We teach literacy about lineage traditions, and the actual rules-based framework only for Devakeralam."
      },
      {
        text: "Direct readings are completely fraudulent, so studying them in any form is a waste of time.",
        type: "scoffing",
        feedback: "Incorrect. Scoffing dismisses the entire study of a significant historical tradition (Layer A) simply because manuscript reading is lineage-protected."
      }
    ]
  },
  {
    id: "sc-2",
    title: "Scenario 2: The 'Where is Vasiṣṭha?' Request",
    question: "A client insists on finding a Vasiṣṭha Nāḍī centre in Delhi, stating: 'I read that Sage Vasiṣṭha was Rama's preceptor, so his Nāḍī must have a prominent centre.' How do you answer?",
    choices: [
      {
        text: "Fabricate a location or promise to locate a Vasiṣṭha reader in Delhi to satisfy the client.",
        type: "mystification",
        feedback: "Incorrect. Fabricating centres or over-stating the presence of attested-but-rare granthas violates the discipline of epistemic humility."
      },
      {
        text: "Acknowledge the attestation of Vasiṣṭha Nāḍī, but state honestly that it is not a central, well-documented practice. Advise against assuming it has a prominent centre, and do not invent details.",
        type: "balanced",
        feedback: "Correct! Epistemic humility requires acknowledging that absence of central documentation is not proof of absolute absence, but we must never fabricate centres."
      },
      {
        text: "Tell them Vasiṣṭha Nāḍī is a fictional name invented to dupe people, and they should stick to Western astrology.",
        type: "scoffing",
        feedback: "Incorrect. Denying the historical attestation of a name because of a modern documentation gap is scoffing."
      }
    ]
  },
  {
    id: "sc-3",
    title: "Scenario 3: The Teachable Status Dilemma",
    question: "A client shows you a printed book of Devakeralam verses and says, 'Since this is published, doesn't it mean all Bhṛgu and Agastya readings are also published somewhere?' How do you respond?",
    choices: [
      {
        text: "Yes, all Maharṣi leaves are digitized and published in secret archives that you can buy online.",
        type: "mystification",
        feedback: "Incorrect. This is Mystification. Bhṛgu and Agastya readings represent lineage-protected manuscript collections of pre-recorded lives, not public rules-based books."
      },
      {
        text: "No. Devakeralam is a rules-based predictive text compiled in verse. Bhṛgu and Agastya readings, however, are lineage-protected manuscript libraries of pre-recorded lives, which are not published texts.",
        type: "balanced",
        feedback: "Correct! Devakeralam is a rules-based, published text that operates closer to a chart-stream method. Bhṛgu and Agastya are lineage-locked matching traditions."
      },
      {
        text: "Devakeralam is a fake book and Bhṛgu leaves don't exist anyway, so it doesn't matter.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing. It denies both the genuine historical publication of Devakeralam and the material footprint of active manuscript libraries."
      }
    ]
  }
];

export function GranthaAccessibilityMap() {
  const [activeTab, setActiveTab] = useState<"tiers" | "dojo">("tiers");
  const [selectedGrantha, setSelectedGrantha] = useState<Grantha>(GRANTHAS[0]);
  const [placedGranthas, setPlacedGranthas] = useState<Record<string, string>>({});
  
  // Feedback state
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "warning-overstatement" | "warning-overcorrection" | "";
    title: string;
    message: string;
  }>({ type: "", title: "", message: "" });

  const [hoveredShelf, setHoveredShelf] = useState<string | null>(null);
  const [shakeShelfId, setShakeShelfId] = useState<string | null>(null);

  // Dojo state
  const [dojoIdx, setDojoIdx] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showDojoFeedback, setShowDojoFeedback] = useState<boolean>(false);

  const isFinishedTiers = Object.keys(placedGranthas).length === GRANTHAS.length;

  const handlePlace = (tierId: string) => {
    if (!selectedGrantha) return;

    const isCorrect = selectedGrantha.correctTier === tierId;

    if (isCorrect) {
      setPlacedGranthas((prev) => ({ ...prev, [selectedGrantha.id]: tierId }));
      setFeedback({
        type: "success",
        title: "Correct Placement!",
        message: `${selectedGrantha.name} matches this tier. ${selectedGrantha.detail}`
      });

      // Find next unplaced
      const nextUnplaced = GRANTHAS.find((g) => g.id !== selectedGrantha.id && !placedGranthas[g.id]);
      if (nextUnplaced) {
        setSelectedGrantha(nextUnplaced);
      }
    } else {
      // Shaking shelf effect
      setShakeShelfId(tierId);
      setTimeout(() => setShakeShelfId(null), 400);

      // Specific warnings logic
      if (
        (selectedGrantha.id === "dhruva" || selectedGrantha.id === "vasistha") &&
        tierId === "highly-active"
      ) {
        setFeedback({
          type: "warning-overstatement",
          title: "⚠️ OVER-STATEMENT WARNING",
          message: `Treating attested-but-rare texts (${selectedGrantha.name}) as highly active living practices with prominent centres violates epistemic humility. These texts are attested in historical catalogues but lack documented modern practice.`
        });
      } else if (
        (selectedGrantha.id === "bhrigu" || selectedGrantha.id === "agastya") &&
        tierId === "attested-rare"
      ) {
        setFeedback({
          type: "warning-overcorrection",
          title: "⚠️ OVER-CORRECTION WARNING",
          message: `Dismissing highly active, historically documented living practices like ${selectedGrantha.name} as rare or fictional is an over-correction. While we must be critical of fraud, we must respect active traditions that maintain physical collections.`
        });
      } else {
        setFeedback({
          type: "error",
          title: "Misclassification",
          message: `Incorrect shelf for ${selectedGrantha.name}. Analyze its material footing and accessibility to find the right tier.`
        });
      }
    }
  };

  const handleSelectGrantha = (g: Grantha) => {
    setSelectedGrantha(g);
    // If already placed, show its detail info in feedback panel
    if (placedGranthas[g.id]) {
      setFeedback({
        type: "success",
        title: "Already Organized",
        message: `${g.name} is on the '${TIERS.find((t) => t.id === placedGranthas[g.id])?.label}' shelf. ${g.detail}`
      });
    } else {
      setFeedback({ type: "", title: "", message: "" });
    }
  };

  // Preset triggers for "Things to try"
  const triggerSimulation = (type: "overstatement" | "overcorrection" | "devakeralam") => {
    if (type === "overstatement") {
      const dhruva = GRANTHAS.find((g) => g.id === "dhruva")!;
      setSelectedGrantha(dhruva);
      setShakeShelfId("highly-active");
      setTimeout(() => setShakeShelfId(null), 400);
      setFeedback({
        type: "warning-overstatement",
        title: "⚠️ OVER-STATEMENT WARNING",
        message: "Treating attested-but-rare texts (Dhruva/Vasiṣṭha) as highly active living practices with prominent centres violates epistemic humility. These texts are attested in historical catalogues but lack documented modern practice."
      });
    } else if (type === "overcorrection") {
      const bhrigu = GRANTHAS.find((g) => g.id === "bhrigu")!;
      setSelectedGrantha(bhrigu);
      setShakeShelfId("attested-rare");
      setTimeout(() => setShakeShelfId(null), 400);
      setFeedback({
        type: "warning-overcorrection",
        title: "⚠️ OVER-CORRECTION WARNING",
        message: "Dismissing highly active, historically documented living practices like Bhṛgu or Agastya as rare or fictional because of modern validation gaps is an over-correction. We must respect active traditions that maintain physical collections."
      });
    } else if (type === "devakeralam") {
      const dk = GRANTHAS.find((g) => g.id === "devakeralam")!;
      setSelectedGrantha(dk);
      setPlacedGranthas((prev) => ({ ...prev, devakeralam: "published" }));
      setFeedback({
        type: "success",
        title: "📘 THE DEVAKERALAM EXCEPTION",
        message: dk.detail
      });
    }
  };

  const resetTiers = () => {
    setPlacedGranthas({});
    setSelectedGrantha(GRANTHAS[0]);
    setFeedback({ type: "", title: "", message: "" });
  };

  // Dojo Logic
  const currentDojo = DOJO_SCENARIOS[dojoIdx];

  const handleDojoSelect = (idx: number) => {
    setSelectedChoice(idx);
    setShowDojoFeedback(true);
  };

  const handleNextDojo = () => {
    setShowDojoFeedback(false);
    setSelectedChoice(null);
    if (dojoIdx < DOJO_SCENARIOS.length - 1) {
      setDojoIdx((prev) => prev + 1);
    }
  };

  const resetDojo = () => {
    setSelectedChoice(null);
    setDojoIdx(0);
    setShowDojoFeedback(false);
  };

  // Helper to get correct feedback alert styles
  const getFeedbackStyles = () => {
    switch (feedback.type) {
      case "success":
        return { bg: "rgba(47, 125, 85, 0.05)", border: GREEN, text: GREEN };
      case "warning-overstatement":
      case "warning-overcorrection":
        return { bg: "rgba(156, 122, 47, 0.05)", border: GOLD, text: GOLD_DEEP };
      case "error":
        return { bg: "rgba(162, 58, 30, 0.05)", border: RED, text: RED };
      default:
        return { bg: "transparent", border: "transparent", text: INK_PRIMARY };
    }
  };

  const fStyle = getFeedbackStyles();

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 246, 0.82)",
        border: "1px solid rgba(156, 122, 47, 0.25)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "960px",
        margin: "0 auto"
      }}
      data-interactive="grantha-accessibility-map"
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .shake-shelf {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>

      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px", marginBottom: "20px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 20 — Chapter 2 — Lesson 4
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Nāḍī Accessibility Tiers Explorer
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Map the wider corpus of Nāḍī texts across accessibility tiers, understand why Devakeralam is the teachable exception, and study request scenarios.
        </p>
      </div>

      {/* Tab Menu */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("tiers")}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            background: activeTab === "tiers" ? GOLD : "rgba(156, 122, 47, 0.06)",
            color: activeTab === "tiers" ? "#fff" : GOLD_DEEP,
            border: "none",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          Accessibility Tiers Cabinet
        </button>
        <button
          onClick={() => setActiveTab("dojo")}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            background: activeTab === "dojo" ? GOLD : "rgba(156, 122, 47, 0.06)",
            color: activeTab === "dojo" ? "#fff" : GOLD_DEEP,
            border: "none",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          Client Request Dojo
        </button>
      </div>

      {activeTab === "tiers" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Quick Simulation Bar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              padding: "10px 14px",
              background: "rgba(156, 122, 47, 0.04)",
              borderRadius: "8px",
              border: "1px solid rgba(156, 122, 47, 0.12)",
              alignItems: "center"
            }}
          >
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "4px" }}>
              <Sparkles size={13} /> QUICK SIMULATIONS:
            </span>
            <button
              onClick={() => triggerSimulation("overstatement")}
              style={{
                background: "#fff",
                border: "1px solid rgba(156,122,47,0.2)",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "11px",
                color: INK_PRIMARY,
                cursor: "pointer",
                fontWeight: 500,
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = GOLD)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(156,122,47,0.2)")}
            >
              Treat Dhruva like Agastya (Over-statement)
            </button>
            <button
              onClick={() => triggerSimulation("overcorrection")}
              style={{
                background: "#fff",
                border: "1px solid rgba(156,122,47,0.2)",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "11px",
                color: INK_PRIMARY,
                cursor: "pointer",
                fontWeight: 500,
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = GOLD)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(156,122,47,0.2)")}
            >
              Treat Bhṛgu as Rare (Over-correction)
            </button>
            <button
              onClick={() => triggerSimulation("devakeralam")}
              style={{
                background: "#fff",
                border: "1px solid rgba(156,122,47,0.2)",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "11px",
                color: INK_PRIMARY,
                cursor: "pointer",
                fontWeight: 500,
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = GOLD)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(156,122,47,0.2)")}
            >
              Open Devakeralam (Teachable status)
            </button>
          </div>

          {/* Main Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px", minHeight: "440px" }}>
            {/* Left Column: SVG Cabinet */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
                Interactive Manuscript Cabinet (Click Shelf to slot selected text)
              </span>

              <div
                style={{
                  background: "#FAF6EB",
                  border: "1px solid rgba(156, 122, 47, 0.15)",
                  borderRadius: "12px",
                  padding: "12px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "inset 0 2px 8px rgba(156,122,47,0.04)"
                }}
              >
                <svg viewBox="0 0 540 360" width="100%" height="auto" style={{ overflow: "visible" }}>
                  {/* Cabinet Outer Frame */}
                  <rect x="5" y="5" width="530" height="350" rx="10" fill="rgba(156, 122, 47, 0.03)" stroke={GOLD} strokeWidth="3" />
                  <rect x="9" y="9" width="522" height="342" rx="8" fill="none" stroke="rgba(156, 122, 47, 0.15)" strokeWidth="1" />

                  {/* Draw Shelves */}
                  {TIERS.map((tier, idx) => {
                    const y = 65 + idx * 62;
                    const isHovered = hoveredShelf === tier.id;
                    const isShaking = shakeShelfId === tier.id;

                    // Filter granthas placed on this shelf
                    const placedOnThisShelf = GRANTHAS.filter((g) => placedGranthas[g.id] === tier.id);

                    return (
                      <g
                        key={tier.id}
                        onMouseEnter={() => setHoveredShelf(tier.id)}
                        onMouseLeave={() => setHoveredShelf(null)}
                        onClick={() => handlePlace(tier.id)}
                        style={{ cursor: "pointer" }}
                        className={isShaking ? "shake-shelf" : ""}
                      >
                        {/* Shelf Background Zone */}
                        <rect
                          x="10"
                          y={y - 50}
                          width="520"
                          height="50"
                          fill={isHovered ? "rgba(156, 122, 47, 0.07)" : "transparent"}
                          style={{ transition: "fill 0.2s" }}
                        />

                        {/* Shelf line */}
                        <line x1="10" y1={y} x2="530" y2={y} stroke={GOLD} strokeWidth="3" />
                        
                        {/* Left bracket */}
                        <path d={`M 10,${y} L 18,${y + 8} L 18,${y} Z`} fill={GOLD_DEEP} />
                        {/* Right bracket */}
                        <path d={`M 530,${y} L 522,${y + 8} L 522,${y} Z`} fill={GOLD_DEEP} />

                        {/* Shelf Labels */}
                        <text x="20" y={y - 30} fill={INK_PRIMARY} fontSize="11.5" fontWeight="700">
                          {tier.label}
                        </text>
                        <text x="20" y={y - 14} fill={INK_MUTED} fontSize="8.5" fontStyle="italic">
                          {tier.sub}
                        </text>

                        {/* Shelf Slots Border */}
                        <rect
                          x="240"
                          y={y - 40}
                          width="270"
                          height="32"
                          rx="4"
                          fill="rgba(156, 122, 47, 0.02)"
                          stroke="rgba(156, 122, 47, 0.15)"
                          strokeWidth="1"
                          strokeDasharray="3,3"
                        />

                        {/* Draw placed manuscript bundles */}
                        {placedOnThisShelf.map((g, gIdx) => {
                          const bookX = 250 + gIdx * 32;
                          const isBookSelected = selectedGrantha?.id === g.id;

                          return (
                            <g
                              key={g.id}
                              onClick={(e) => {
                                e.stopPropagation(); // Avoid triggering shelf placement
                                handleSelectGrantha(g);
                              }}
                            >
                              {/* Glowing highlight ring if selected */}
                              {isBookSelected && (
                                <rect
                                  x={bookX - 2}
                                  y={y - 32}
                                  width="28"
                                  height="18"
                                  rx="3"
                                  fill="none"
                                  stroke={GOLD}
                                  strokeWidth="2"
                                />
                              )}
                              
                              {/* Palm Leaf Manuscript bundle */}
                              <rect
                                x={bookX}
                                y={y - 30}
                                width="24"
                                height="14"
                                rx="1.5"
                                fill="#d9c29c"
                                stroke={GOLD_DEEP}
                                strokeWidth="1.5"
                                style={{ transition: "all 0.2s" }}
                              />

                              {/* Binding Cord */}
                              <line x1={bookX + 8} y1={y - 30} x2={bookX + 8} y2={y - 16} stroke={RED} strokeWidth="1.5" />
                              <line x1={bookX + 16} y1={y - 30} x2={bookX + 16} y2={y - 16} stroke={RED} strokeWidth="1.5" />

                              {/* Tiny code label */}
                              <text x={bookX + 12} y={y - 21} textAnchor="middle" fontSize="6.5" fontWeight="900" fill={INK_PRIMARY}>
                                {g.short}
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Right Column: Selected Info, Feedback, and Buttons */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Active Selection Details */}
                <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "10px", padding: "16px", boxShadow: "0 2px 10px rgba(156,122,47,0.04)" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "4px" }}>
                    <BookOpen size={12} /> ACTIVE SELECTION FOR PLACEMENT
                  </span>
                  <h4 style={{ margin: "6px 0 2px", fontSize: "16px", fontWeight: 700, color: INK_PRIMARY }}>
                    {selectedGrantha.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.45" }}>
                    {selectedGrantha.desc}
                  </p>
                  
                  {placedGranthas[selectedGrantha.id] ? (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "8px", fontSize: "11px", color: GREEN, fontWeight: 600 }}>
                      <CheckCircle2 size={12} /> Placed under {TIERS.find((t) => t.id === placedGranthas[selectedGrantha.id])?.label}
                    </div>
                  ) : (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "8px", fontSize: "11px", color: GOLD_DEEP, fontWeight: 500 }}>
                      <Info size={11} /> Click a shelf on the cabinet to slot this text.
                    </div>
                  )}
                </div>

                {/* Feedback Panel */}
                {feedback.message && (
                  <div
                    style={{
                      padding: "14px",
                      borderRadius: "8px",
                      background: fStyle.bg,
                      border: `1.5px solid ${fStyle.border}`,
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      transition: "all 0.2s"
                    }}
                  >
                    {feedback.type === "success" ? (
                      <CheckCircle2 size={18} style={{ color: GREEN, flexShrink: 0, marginTop: "2px" }} />
                    ) : feedback.type.includes("warning") ? (
                      <AlertTriangle size={18} style={{ color: GOLD, flexShrink: 0, marginTop: "2px" }} />
                    ) : (
                      <AlertTriangle size={18} style={{ color: RED, flexShrink: 0, marginTop: "2px" }} />
                    )}
                    <div>
                      <h5 style={{ margin: "0 0 4px", fontSize: "12.5px", fontWeight: 700, color: fStyle.text }}>
                        {feedback.title}
                      </h5>
                      <p style={{ margin: 0, fontSize: "12.5px", color: INK_PRIMARY, lineHeight: "1.45" }}>
                        {feedback.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Unplaced Granthas Shelf Area */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
                  GRANTHA REPOSITORY (Click to select)
                </span>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {GRANTHAS.map((g) => {
                    const isSelected = selectedGrantha.id === g.id;
                    const isPlaced = !!placedGranthas[g.id];

                    return (
                      <button
                        key={g.id}
                        onClick={() => handleSelectGrantha(g)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: isSelected
                            ? `1.5px solid ${GOLD}`
                            : isPlaced
                            ? "1px solid rgba(47, 125, 85, 0.2)"
                            : "1px solid rgba(156, 122, 47, 0.15)",
                          background: isSelected
                            ? "rgba(156, 122, 47, 0.06)"
                            : isPlaced
                            ? "rgba(47, 125, 85, 0.02)"
                            : "#fff",
                          color: INK_PRIMARY,
                          cursor: "pointer",
                          fontWeight: isSelected ? 600 : 500,
                          fontSize: "12.5px",
                          textAlign: "left",
                          transition: "all 0.15s"
                        }}
                      >
                        <span>{g.name}</span>
                        {isPlaced ? (
                          <CheckCircle2 size={13} style={{ color: GREEN }} />
                        ) : (
                          <span style={{ fontSize: "9px", color: GOLD_DEEP, padding: "2px 5px", background: GOLD_LIGHT, borderRadius: "4px", fontWeight: 600 }}>
                            {g.short}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {isFinishedTiers ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: GREEN, fontWeight: 700, fontSize: "13.5px" }}>
                      <BookOpenCheck size={16} /> All Granthas Organized!
                    </div>
                    <button
                      onClick={resetTiers}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 14px",
                        borderRadius: "6px",
                        background: GREEN,
                        color: "#fff",
                        border: "none",
                        fontWeight: 600,
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                    >
                      <RefreshCw size={12} /> Reset Sorting
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginTop: "8px" }}>
                    <HelpCircle size={14} style={{ color: GOLD_DEEP, flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "11.5px", color: INK_MUTED, lineHeight: "1.4" }}>
                      Organize all 8 texts on their shelves to unlock full alignment validation.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Dojo */
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", minHeight: "440px" }}>
          <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                {currentDojo.title}
              </span>
              <span style={{ fontSize: "11px", color: INK_MUTED }}>
                Scenario {dojoIdx + 1} of {DOJO_SCENARIOS.length}
              </span>
            </div>

            <p style={{ fontSize: "14.5px", color: INK_PRIMARY, fontWeight: 600, margin: "0 0 20px" }}>
              {currentDojo.question}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {currentDojo.choices.map((c, idx) => {
                const isSelected = selectedChoice === idx;
                let borderColor = "rgba(156, 122, 47, 0.25)";
                let bg = "#fff";
                if (showDojoFeedback && isSelected) {
                  borderColor = c.type === "balanced" ? GREEN : RED;
                  bg = c.type === "balanced" ? "rgba(47,125,85,0.06)" : "rgba(162,58,30,0.06)";
                } else if (isSelected) {
                  borderColor = GOLD;
                  bg = "rgba(156,122,47,0.04)";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleDojoSelect(idx)}
                    style={{
                      textAlign: "left",
                      padding: "14px",
                      borderRadius: "8px",
                      border: `1.5px solid ${borderColor}`,
                      background: bg,
                      fontSize: "13.5px",
                      color: INK_PRIMARY,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px"
                    }}
                  >
                    <span
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        border: `1.5px solid ${GOLD}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        fontWeight: "bold",
                        background: isSelected ? GOLD : "transparent",
                        color: isSelected ? "#fff" : GOLD,
                        flexShrink: 0,
                        marginTop: "1px"
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span style={{ lineHeight: "1.4" }}>{c.text}</span>
                  </button>
                );
              })}
            </div>

            {showDojoFeedback && selectedChoice !== null && (
              <div style={{ marginTop: "20px" }}>
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    background: currentDojo.choices[selectedChoice].type === "balanced" ? "rgba(47,125,85,0.06)" : "rgba(162,58,30,0.06)",
                    border: `1px solid ${currentDojo.choices[selectedChoice].type === "balanced" ? GREEN : RED}`,
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start"
                  }}
                >
                  {currentDojo.choices[selectedChoice].type === "balanced" ? (
                    <CheckCircle2 size={20} style={{ color: GREEN, flexShrink: 0 }} />
                  ) : (
                    <AlertTriangle size={20} style={{ color: RED, flexShrink: 0 }} />
                  )}
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 700, color: currentDojo.choices[selectedChoice].type === "balanced" ? GREEN : RED }}>
                      {currentDojo.choices[selectedChoice].type === "balanced" ? "CORRECT HANDLING" : "DOCTRINAL MISUNDERSTANDING"}
                    </h4>
                    <p style={{ margin: 0, fontSize: "13.5px", color: INK_PRIMARY, lineHeight: "1.45" }}>
                      {currentDojo.choices[selectedChoice].feedback}
                    </p>
                  </div>
                </div>

                {currentDojo.choices[selectedChoice].type === "balanced" && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                    {dojoIdx < DOJO_SCENARIOS.length - 1 ? (
                      <button
                        onClick={handleNextDojo}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "6px",
                          background: GREEN,
                          color: "#fff",
                          border: "none",
                          fontWeight: 600,
                          fontSize: "13px",
                          cursor: "pointer"
                        }}
                      >
                        Next Scenario
                      </button>
                    ) : (
                      <button
                        onClick={resetDojo}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          background: GREEN,
                          color: "#fff",
                          border: "none",
                          fontWeight: 600,
                          fontSize: "13px",
                          cursor: "pointer"
                        }}
                      >
                        <RefreshCw size={14} /> Reset Dojo
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
