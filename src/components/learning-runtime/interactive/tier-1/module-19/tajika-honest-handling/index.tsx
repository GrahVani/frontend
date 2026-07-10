"use client";

import { useState } from "react";
import {
  Layers,
  CheckCircle2,
  Compass,
  Map as MapIcon,
  AlertTriangle
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

interface TimelineNode {
  id: "greek" | "arabic" | "sanskrit";
  title: string;
  era: string;
  contributions: string[];
  description: string;
}

const TIMELINE_NODES: TimelineNode[] = [
  {
    id: "greek",
    title: "Hellenistic Greece",
    era: "1c BCE - 2c CE",
    contributions: ["Lots (Kleros) ➔ Sahams", "Annual Revolutions ➔ Varṣaphala", "Hourly/Daily Question Charts"],
    description: "The structural origin of lot-based calculations (sahams) and progressed-point annual solar revolutions (anniversarium) was established in Alexandria and Hellenistic Greece."
  },
  {
    id: "arabic",
    title: "Persian-Arabic Intermediate",
    era: "8c CE - 12c CE",
    contributions: ["Applying/Separating Aspects ➔ Yogas", "Almutem ➔ Varṣeśa", "Masā'il ➔ Praśna"],
    description: "Islamic scholars translated, mathematically refined, and catalogued aspectual relationship rules (e.g. ittiṣāl, insirāf) and calculated the strongest ruler planet (Almutem)."
  },
  {
    id: "sanskrit",
    title: "Sanskritization (India)",
    era: "12c CE - 16c CE",
    contributions: ["Sanskritized Terminology", "Sidereal Zodiac Integration", "Pandit Nīlakaṇṭha (1587 CE)"],
    description: "Indian scholars translated these Arabo-Persian texts into classical Sanskrit, integrating the techniques with the sidereal zodiac, standard Vedic calculations, and regional commentarial lineages."
  }
];

const ETYMOLOGIES = [
  { term: "Ithasāla Yoga", root: "ittiṣāl (Arabic)", meaning: "Connection / Applying Aspect" },
  { term: "Eesarphā Yoga", root: "insirāf (Arabic)", meaning: "Departure / Separating Aspect" },
  { term: "Saham", root: "sahm (Arabic) / klēros (Greek)", meaning: "Arrow / Lot / Sensitive Point" },
  { term: "Munthā", root: "muntahā (Arabic)", meaning: "Limit / Yearly progressed point" },
  { term: "Varṣeśa", root: "Almutem correspondence (Arabic)", meaning: "Yearly Lord / Candidate Strength" }
];

interface DojoQuestion {
  id: number;
  scenario: string;
  query: string;
  options: {
    text: string;
    isCorrect: boolean;
    errorType: "mystification" | "scoffing" | "none";
    feedback: string;
  }[];
}

const DOJO_QUESTIONS: DojoQuestion[] = [
  {
    id: 1,
    scenario: "A client mentions: 'I read online that Tājika has Arabic/Persian origins, so it is a foreign intrusion and cannot be real Vedic astrology. They said I should completely reject Varṣaphala and Tājika Praśna as un-Vedic.'",
    query: "How do you counsel them using the bidirectional honest-handling protocol?",
    options: [
      {
        text: "Agree with the client. Tell them Tājika is indeed foreign, and because it lacks pure indigenous Vedic origin, they should ignore it and focus only on Parāśarī.",
        isCorrect: false,
        errorType: "scoffing",
        feedback: "Scoffing Failure! This dismisses a valid canonical sub-tradition purely because of its cross-cultural transmission heritage, violating the multi-streams-valid principle."
      },
      {
        text: "Tell the client that Tājika is actually 100% indigenous Sanskrit, and that all claims of Arabic or Persian etymology are modern academic fabrications.",
        isCorrect: false,
        errorType: "mystification",
        feedback: "Mystification Failure! This makes an ahistorical purity claim and denies documented cross-cultural etymological transmission evidence."
      },
      {
        text: "Acknowledge Tājika's dual-root heritage: it is a legitimate Vedic astrology sub-tradition that operates within the Vedic framework (sidereal zodiac, Sanskrit canon, and cross-stream integration), but transparently incorporates Greek and Arabo-Persian historical transmissions. Emphasize that cross-cultural synthesis is a strength, not a defect.",
        isCorrect: true,
        errorType: "none",
        feedback: "Correct! This maintains two-layer holding by honoring Tājika's place in Vedic astrology while honestly acknowledging its historical cross-cultural roots."
      }
    ]
  },
  {
    id: 2,
    scenario: "A traditional scholar argues: 'Pandit Nīlakaṇṭha was a Sanskrit pandit, and Tājika Nīlakaṇṭhī is written in classical Sanskrit verses. Any claim that the term Ithasāla is derived from the Arabic word \"ittiṣāl\" is an academic error. Astrologers must refuse these foreign etymologies to preserve tradition purity.'",
    query: "How do you respond to this argument?",
    options: [
      {
        text: "Agree and remove all Arabic etymologies. We must present Tājika as purely Sanskrit-derived to keep our teachings pure.",
        isCorrect: false,
        errorType: "mystification",
        feedback: "Mystification Failure! This denies the Sanskritization process and erases the Arabo-Persian terminology explicitly preserved in the Sanskrit canonical texts."
      },
      {
        text: "Explain that while Nīlakaṇṭhī is a classical Sanskrit masterpiece, its terminology directly Sanskritizes Arabo-Persian horoscopic terms. Explain that Tājika's validity stands on its mathematical rigor, empirical value, and centuries of community validation, NOT on origin purity. Acknowledge etymology transparently.",
        isCorrect: true,
        errorType: "none",
        feedback: "Correct! This refutes mystification, validates methodology independent of origin purity, and draws a clear parallel to other historical syntheses."
      },
      {
        text: "Declare that since Tājika has foreign elements, the scholar is right that it is not pure, and therefore we should reject the Nīlakaṇṭhī altogether.",
        isCorrect: false,
        errorType: "scoffing",
        feedback: "Scoffing Failure! This commits the xenophobic dismissal fallacy, throwing away centuries of valid Sanskrit canonical heritage due to its cross-cultural elements."
      }
    ]
  }
];

export function TajikaHonestHandling() {
  const [activeTab, setActiveTab] = useState<"map" | "dojo">("map");
  const [selectedNode, setSelectedNode] = useState<"greek" | "arabic" | "sanskrit">("sanskrit");

  // Dojo states
  const [dojoIdx, setDojoIdx] = useState<number>(0);
  const [selectedDojoOpt, setSelectedDojoOpt] = useState<number | null>(null);
  const [dojoFeedback, setDojoFeedback] = useState<string>("");

  const activeNode = TIMELINE_NODES.find(n => n.id === selectedNode) || TIMELINE_NODES[2];
  const currentDojo = DOJO_QUESTIONS[dojoIdx];

  const handleDojoOptionSelect = (idx: number) => {
    setSelectedDojoOpt(idx);
    setDojoFeedback(currentDojo.options[idx].feedback);
  };

  const handleNextDojo = () => {
    setDojoIdx(prev => (prev + 1) % DOJO_QUESTIONS.length);
    setSelectedDojoOpt(null);
    setDojoFeedback("");
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 246, 0.75)",
        border: "1px solid rgba(156, 122, 47, 0.2)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "920px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}
      data-interactive="tajika-honest-handling"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 6 — Lesson 2
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Tājika Honest-Handling Protocol
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Analyze Tājika's dual-root cross-cultural transmission and practice the bidirectional refusal dojo (refusing mystification & scoffing).
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1.5px solid rgba(156,122,47,0.1)" }}>
        <button
          onClick={() => setActiveTab("map")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            border: "none",
            background: activeTab === "map" ? "rgba(156, 122, 47, 0.08)" : "none",
            borderBottom: activeTab === "map" ? `3.5px solid ${GOLD}` : "3.5px solid transparent",
            color: activeTab === "map" ? GOLD_DEEP : INK_SECONDARY,
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: activeTab === "map" ? 700 : 500,
            borderRadius: "6px 6px 0 0"
          }}
        >
          <MapIcon size={16} />
          Dual-Root Transmission Map
        </button>
        <button
          onClick={() => setActiveTab("dojo")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            border: "none",
            background: activeTab === "dojo" ? "rgba(156, 122, 47, 0.08)" : "none",
            borderBottom: activeTab === "dojo" ? `3.5px solid ${GOLD}` : "3.5px solid transparent",
            color: activeTab === "dojo" ? GOLD_DEEP : INK_SECONDARY,
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: activeTab === "dojo" ? 700 : 500,
            borderRadius: "6px 6px 0 0"
          }}
        >
          <Layers size={16} />
          Bidirectional Dojo
        </button>
      </div>

      {/* Panel 1: Transmission Map */}
      {activeTab === "map" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Interactive Geographic Knowledge Flow Map (SVG) */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(156,122,47,0.12)", borderRadius: "12px", padding: "20px 10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, alignSelf: "flex-start", marginBottom: "12px", textTransform: "uppercase", paddingLeft: "10px" }}>
              Geographic Knowledge Flow Map (Click nodes to inspect):
            </span>
            <svg width="100%" height="150" viewBox="0 0 540 150" style={{ overflow: "visible", background: "#fcfaf4", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px" }}>
              <defs>
                <style dangerouslySetInnerHTML={{ __html: `
                  @keyframes path-dash {
                    to {
                      stroke-dashoffset: -20;
                    }
                  }
                  .map-flow-line {
                    stroke-dasharray: 6,4;
                    animation: path-dash 1.5s infinite linear;
                  }
                `}} />
              </defs>

              {/* Ambient vintage map details (compass rose) */}
              <circle cx="490" cy="30" r="15" fill="none" stroke="rgba(156, 122, 47, 0.15)" strokeWidth="1" />
              <line x1="490" y1="10" x2="490" y2="50" stroke="rgba(156, 122, 47, 0.15)" strokeWidth="1" />
              <line x1="470" y1="30" x2="510" y2="30" stroke="rgba(156, 122, 47, 0.15)" strokeWidth="1" />
              <text x="490" y="22" fill="rgba(156, 122, 47, 0.25)" fontSize="8" fontWeight="bold" textAnchor="middle">N</text>

              {/* Route 1: Alexandria to Baghdad */}
              <path
                d="M 80,70 Q 170,45 260,60"
                fill="none"
                stroke={selectedNode === "arabic" || selectedNode === "sanskrit" ? GOLD : "rgba(156, 122, 47, 0.2)"}
                strokeWidth="2.5"
                className="map-flow-line"
                style={{ transition: "stroke 300ms ease" }}
              />

              {/* Route 2: Baghdad to Varanasi */}
              <path
                d="M 260,60 Q 360,50 460,80"
                fill="none"
                stroke={selectedNode === "sanskrit" ? GOLD : "rgba(156, 122, 47, 0.2)"}
                strokeWidth="2.5"
                className="map-flow-line"
                style={{ transition: "stroke 300ms ease" }}
              />

              {/* Interactive nodes */}
              {TIMELINE_NODES.map((node, idx) => {
                const isSelected = selectedNode === node.id;
                const cx = idx === 0 ? 80 : idx === 1 ? 260 : 460;
                const cy = idx === 0 ? 70 : idx === 1 ? 60 : 80;
                
                return (
                  <g
                    key={node.id}
                    cursor="pointer"
                    onClick={() => setSelectedNode(node.id)}
                  >
                    {/* Ring highlight */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 18 : 12}
                      fill={isSelected ? "rgba(156, 122, 47, 0.15)" : "#ffffff"}
                      stroke={isSelected ? GOLD : "rgba(156, 122, 47, 0.4)"}
                      strokeWidth={isSelected ? 3 : 1.5}
                      style={{ transition: "all 200ms ease" }}
                    />
                    {/* Core dot */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill={isSelected ? GOLD_DEEP : "rgba(156, 122, 47, 0.6)"}
                      style={{ transition: "fill 200ms ease" }}
                    />
                    {/* Label above */}
                    <text
                      x={cx}
                      y={cy - 22}
                      textAnchor="middle"
                      fill={isSelected ? GOLD_DEEP : INK_SECONDARY}
                      fontSize="11"
                      fontWeight={isSelected ? "bold" : "600"}
                      style={{ transition: "fill 200ms ease" }}
                    >
                      {node.title}
                    </text>
                    {/* Era below */}
                    <text
                      x={cx}
                      y={cy + 22}
                      textAnchor="middle"
                      fill={INK_MUTED}
                      fontSize="9.5"
                    >
                      {node.era}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Node Details Card in Scroll-parchment styling */}
            <div
              style={{
                width: "95%",
                background: "rgba(156, 122, 47, 0.03)",
                border: `1.5px dashed ${GOLD}`,
                borderRadius: "8px",
                padding: "16px",
                marginTop: "16px",
                textAlign: "left"
              }}
            >
              <h4 style={{ margin: "0 0 6px 0", color: GOLD_DEEP, fontSize: "15px", fontWeight: 700 }}>
                {activeNode.title} ({activeNode.era})
              </h4>
              <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                {activeNode.description}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {activeNode.contributions.map((contr, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "#ffffff",
                      border: "1px solid rgba(156, 122, 47, 0.15)",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: GOLD_DEEP
                    }}
                  >
                    {contr}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Etymology Mapping Table */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Compass size={16} color={GOLD} />
              <label style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                Terminology & Etymological Roots:
              </label>
            </div>
            <div
              style={{
                background: "#ffffff",
                border: "1px solid rgba(156, 122, 47, 0.12)",
                borderRadius: "10px",
                overflow: "hidden"
              }}
            >
              <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "rgba(156,122,47,0.05)", borderBottom: "1px solid rgba(156,122,47,0.12)" }}>
                    <th style={{ padding: "10px 14px", fontWeight: 700, color: GOLD_DEEP }}>Tājika Sanskrit Term</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700, color: GOLD_DEEP }}>Historical Root</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700, color: GOLD_DEEP }}>Doctrinal Signification</th>
                  </tr>
                </thead>
                <tbody>
                  {ETYMOLOGIES.map((et, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: idx === ETYMOLOGIES.length - 1 ? "none" : "1px solid rgba(156,122,47,0.06)",
                        background: idx % 2 === 0 ? "rgba(255,255,255,1)" : "rgba(156,122,47,0.01)"
                      }}
                    >
                      <td style={{ padding: "10px 14px", fontWeight: 600, color: INK_PRIMARY }}>{et.term}</td>
                      <td style={{ padding: "10px 14px", fontStyle: "italic", color: AMBER }}>{et.root}</td>
                      <td style={{ padding: "10px 14px", color: INK_SECONDARY }}>{et.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Panel 2: Bidirectional Dojo */}
      {activeTab === "dojo" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div
            style={{
              background: "#ffffff",
              border: "1px solid rgba(156, 122, 47, 0.15)",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              boxShadow: "0 4px 16px rgba(156, 122, 47, 0.02)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Layers size={18} color={GOLD} />
                <span style={{ fontWeight: 700, color: GOLD_DEEP, fontSize: "15px" }}>
                  Honest-Handling Case {dojoIdx + 1} of {DOJO_QUESTIONS.length}
                </span>
              </div>
              <button
                onClick={handleNextDojo}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: GOLD_DEEP,
                  fontSize: "12.5px",
                  fontWeight: "bold",
                  textDecoration: "underline"
                }}
              >
                Next Case
              </button>
            </div>

            {/* Scenario block */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <p style={{ margin: 0, fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.5" }}>
                <strong>Scenario:</strong> {currentDojo.scenario}
              </p>
              <div
                style={{
                  background: "rgba(156, 122, 47, 0.04)",
                  borderLeft: `4px solid ${GOLD}`,
                  padding: "10px 14px",
                  fontSize: "13.5px",
                  lineHeight: "1.5",
                  fontWeight: 600,
                  color: INK_PRIMARY,
                  borderRadius: "0 6px 6px 0"
                }}
              >
                {currentDojo.query}
              </div>
            </div>

            {/* Options list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {currentDojo.options.map((opt, idx) => {
                const isSelected = selectedDojoOpt === idx;
                const borderCol = isSelected ? (opt.isCorrect ? GREEN : RED) : "rgba(156, 122, 47, 0.15)";
                const bgCol = isSelected ? (opt.isCorrect ? "rgba(47, 125, 85, 0.04)" : "rgba(162, 58, 30, 0.04)") : "#ffffff";

                return (
                  <button
                    key={idx}
                    onClick={() => handleDojoOptionSelect(idx)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      background: bgCol,
                      border: `1px solid ${borderCol}`,
                      cursor: "pointer",
                      fontSize: "13px",
                      color: INK_SECONDARY,
                      lineHeight: "1.5",
                      transition: "all 150ms ease",
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.01)"
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: `1.5px solid ${isSelected ? (opt.isCorrect ? GREEN : RED) : INK_MUTED}`,
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: isSelected ? (opt.isCorrect ? GREEN : RED) : INK_MUTED,
                        flexShrink: 0,
                        marginTop: "2px"
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Dojo Feedback box */}
            {selectedDojoOpt !== null && (
              <div
                style={{
                  background: currentDojo.options[selectedDojoOpt].isCorrect
                    ? "rgba(47, 125, 85, 0.08)"
                    : "rgba(162, 58, 30, 0.08)",
                  border: `1px solid ${currentDojo.options[selectedDojoOpt].isCorrect ? GREEN : RED}`,
                  color: currentDojo.options[selectedDojoOpt].isCorrect ? GREEN : RED,
                  borderRadius: "8px",
                  padding: "12px 14px",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px"
                }}
              >
                {currentDojo.options[selectedDojoOpt].isCorrect ? (
                  <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                ) : (
                  <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                )}
                <div>
                  <strong style={{ display: "block", marginBottom: "4px" }}>
                    {currentDojo.options[selectedDojoOpt].errorType === "mystification"
                      ? "⚠️ Mystification Violation"
                      : currentDojo.options[selectedDojoOpt].errorType === "scoffing"
                      ? "⚠️ Scoffing Violation"
                      : "✓ Correct Acknowledgment"}
                  </strong>
                  <span>{dojoFeedback}</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
