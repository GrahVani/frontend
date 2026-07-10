"use client";

import { useState } from "react";
import {
  Layers,
  Settings,
  Compass,
  Map as MapIcon,
  Award,
  Copy,
  Check,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

interface ChapterArcNode {
  chapter: number;
  title: string;
  contribution: string;
  consumes: string[];
  produces: string[];
}

const CHAPTER_ARC: ChapterArcNode[] = [
  {
    chapter: 1,
    title: "Origins & Comparative Position",
    contribution: "Foundational history of Sanskritization (12-16c CE), dual-root heritage, and comparative position within the stream-ecosystem.",
    consumes: ["Historical source texts"],
    produces: ["Cross-cultural absorption framing", "Two-layer holding rules"]
  },
  {
    chapter: 2,
    title: "16 Tājika Yogas",
    contribution: "Aspectual dynamics (applying Ithasāla, separating Eesarphā) and the remaining 14 specialized yogas.",
    consumes: ["Lagna & planetary degrees", "Deeptāmśa orbs"],
    produces: ["Yoga application workflow", "Aspect-based trend indications"]
  },
  {
    chapter: 3,
    title: "50 Sahams",
    contribution: "Calculation of day/night reversed sensitive points (sahams) across 7 functional categories.",
    consumes: ["Lagna & planetary longitudes", "Day/night birth status"],
    produces: ["Punya/Karma saham triggers", "Multi-saham analysis workflow"]
  },
  {
    chapter: 4,
    title: "Munthā & Varṣaphala",
    contribution: "Annual solar-return mechanics including munthā progression, Pańcavargi-bala strength, and Varṣeśa lord selection.",
    consumes: ["Solar return birth moment", "Pańcavargi calculations"],
    produces: ["Varṣaphala chart", "Five-layer reading sequence"]
  },
  {
    chapter: 5,
    title: "Tājika Praśna",
    contribution: "Horary question-moment chart judgment using Yogas and Sahams compared against KP Horary.",
    consumes: ["Question moment (Praśna-kāla)", "Domain house mapping"],
    produces: ["Yes/No trend verdict", "Convergent-verdict confidence rules"]
  },
  {
    chapter: 6,
    title: "Synthesis & Closure",
    contribution: "Natal-promise × Year-activation synthesis, honest-handling (refusal of mystification/scoffing), and closure.",
    consumes: ["Parāśarī natal baseline", "All M19 chapter outcomes"],
    produces: ["Cross-stream integration protocol", "Practitioner discipline statement"]
  }
];

interface ModuleStatus {
  id: string;
  name: string;
  status: "complete" | "pending";
}

const MODULE_ROADMAP: ModuleStatus[] = [
  { id: "M01", name: "Intro to Jyotiṣa", status: "complete" },
  { id: "M02-M15", name: "Foundation & Classical Texts", status: "pending" },
  { id: "M16", name: "KP Stream", status: "pending" },
  { id: "M17", name: "Jaimini Stream", status: "pending" },
  { id: "M18", name: "Lal Kitab", status: "pending" },
  { id: "M19", name: "Tājika Stream", status: "complete" },
  { id: "M20", name: "Nāḍī Stream", status: "complete" },
  { id: "M21", name: "Numerology", status: "complete" },
  { id: "M22", name: "Vāstu Shāstra", status: "complete" },
  { id: "M23", name: "Muhūrta", status: "complete" },
  { id: "M24", name: "Ethics & History", status: "complete" }
];

export function M19Closure() {
  const [activeTab, setActiveTab] = useState<"arc" | "creator" | "roadmap">("arc");
  const [selectedCh, setSelectedCh] = useState<number>(6);

  // Statement Creator Form States
  const [context, setContext] = useState<string>("Professional Consultations");
  const [framework, setFramework] = useState<string>("Full M19 toolkit (16 Yogas, 50 Sahams, Varṣaphala, Praśna)");
  const [ethics, setEthics] = useState<string>("Bidirectional honest-handling (refusing mystification/scoffing) & two-layer holding");
  const [integration, setIntegration] = useState<string>("Natal-Promise (Parāśarī) × Year-Activation (Tājika) & KP comparison");
  const [development, setDevelopment] = useState<string>("Study of Tājika Nīlakaṇṭhī, remaining modules completion, & community practice");
  
  const [statementCompiled, setStatementCompiled] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const activeChapter = CHAPTER_ARC.find(c => c.chapter === selectedCh) || CHAPTER_ARC[5];

  const handleCompile = () => {
    setStatementCompiled(true);
    setIsCopied(false);
  };

  const getCompiledText = () => {
    return `TĀJIKA PRACTITIONER DISCIPLINE STATEMENT
-----------------------------------------
1. PRACTITIONER CONTEXT:
I apply Tājika annual and horary techniques in the context of: ${context}.

2. ANALYTICAL FRAMEWORK:
I commit to operating the: ${framework}.

3. ETHICAL DISCIPLINE:
I uphold the principles of: ${ethics}.

4. CROSS-STREAM INTEGRATION PROTOCOL:
My protocol for integrating multiple systems is: ${integration}.

5. ONGOING DEVELOPMENT COMMITMENT:
My commitment to learning and tradition-relationship is: ${development}.

-----------------------------------------
Formally created per Grahvani Module 19 (Tājika Stream) Closure Protocol.`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCompiledText());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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
      data-interactive="m19-closure"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 6 — Lesson 3
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          M19 Module Closure Surface
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Explore the modular pipeline, generate your 5-field practitioner-discipline statement, and view the actual curriculum roadmap.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1.5px solid rgba(156,122,47,0.1)" }}>
        {[
          { id: "arc", label: "Six-Chapter Arc Visualizer", icon: Compass },
          { id: "creator", label: "Practitioner Statement Creator", icon: Award },
          { id: "roadmap", label: "Curriculum Roadmap Timeline", icon: MapIcon }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "arc" | "creator" | "roadmap")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                border: "none",
                background: isActive ? "rgba(156, 122, 47, 0.08)" : "none",
                borderBottom: isActive ? `3.5px solid ${GOLD}` : "3.5px solid transparent",
                color: isActive ? GOLD_DEEP : INK_SECONDARY,
                cursor: "pointer",
                fontSize: "13.5px",
                fontWeight: isActive ? 700 : 500,
                borderRadius: "6px 6px 0 0",
                transition: "all 200ms ease"
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Six-Chapter Arc Visualizer */}
      {activeTab === "arc" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Modular Assembly Line Flowchart (SVG) */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(156,122,47,0.12)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, alignSelf: "flex-start", marginBottom: "16px", textTransform: "uppercase" }}>
              M19 Chapter Pipeline (Click nodes to trace):
            </span>
            
            <svg width="100%" height="110" viewBox="0 0 540 110" style={{ overflow: "visible", background: "#fcfaf4", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px" }}>
              <defs>
                <style dangerouslySetInnerHTML={{ __html: `
                  @keyframes pipe-dash {
                    to {
                      stroke-dashoffset: -20;
                    }
                  }
                  .pipe-flow-line {
                    stroke-dasharray: 6,4;
                    animation: pipe-dash 1.5s infinite linear;
                  }
                `}} />
              </defs>

              {/* Dynamic Connection Paths */}
              {Array.from({ length: 5 }).map((_, idx) => {
                const startX = 45 + idx * 90;
                const endX = 45 + (idx + 1) * 90;
                const isFlowing = selectedCh > idx + 1;
                return (
                  <path
                    key={idx}
                    d={`M ${startX},55 L ${endX},55`}
                    fill="none"
                    stroke={isFlowing ? GOLD : "rgba(156, 122, 47, 0.2)"}
                    strokeWidth="3"
                    className={isFlowing ? "pipe-flow-line" : ""}
                    style={{ transition: "stroke 300ms ease" }}
                  />
                );
              })}

              {/* Interactive Chapter Nodes */}
              {CHAPTER_ARC.map((ch, idx) => {
                const cx = 45 + idx * 90;
                const isSelected = selectedCh === ch.chapter;
                return (
                  <g
                    key={ch.chapter}
                    cursor="pointer"
                    onClick={() => setSelectedCh(ch.chapter)}
                  >
                    {/* Glowing highlight aura */}
                    <circle
                      cx={cx}
                      cy={55}
                      r={isSelected ? 20 : 14}
                      fill={isSelected ? "rgba(156, 122, 47, 0.15)" : "#ffffff"}
                      stroke={isSelected ? GOLD : "rgba(156, 122, 47, 0.4)"}
                      strokeWidth={isSelected ? 3.5 : 1.5}
                      style={{ transition: "all 250ms ease" }}
                    />
                    {/* Internal core */}
                    <circle
                      cx={cx}
                      cy={55}
                      r={7}
                      fill={isSelected ? GOLD_DEEP : "rgba(156, 122, 47, 0.6)"}
                      style={{ transition: "fill 250ms ease" }}
                    />
                    {/* Chapter Label above */}
                    <text
                      x={cx}
                      y={26}
                      textAnchor="middle"
                      fill={isSelected ? GOLD_DEEP : INK_SECONDARY}
                      fontSize="9.5"
                      fontWeight="bold"
                      style={{ transition: "fill 250ms ease" }}
                    >
                      CH {ch.chapter}
                    </text>
                    {/* Short title below */}
                    <text
                      x={cx}
                      y={88}
                      textAnchor="middle"
                      fill={isSelected ? GOLD_DEEP : INK_MUTED}
                      fontSize="8"
                      fontWeight={isSelected ? "bold" : "normal"}
                      style={{ transition: "fill 250ms ease" }}
                    >
                      {ch.title.split(" ")[0]}...
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Trace Details Card */}
            <div
              style={{
                width: "100%",
                background: "rgba(156, 122, 47, 0.03)",
                border: `1.5px dashed ${GOLD}`,
                borderRadius: "8px",
                padding: "16px",
                marginTop: "16px",
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr 1fr",
                gap: "16px",
                textAlign: "left"
              }}
            >
              <div>
                <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                  Logical Contribution (Chapter {activeChapter.chapter}):
                </span>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                  {activeChapter.contribution}
                </p>
              </div>
              <div>
                <span style={{ fontSize: "10px", fontWeight: 700, color: GREEN, textTransform: "uppercase" }}>
                  Consumes (Inputs):
                </span>
                <ul style={{ margin: "4px 0 0", paddingLeft: "16px", fontSize: "12.5px", color: INK_SECONDARY }}>
                  {activeChapter.consumes.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: "2px" }}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                  Produces (Outputs):
                </span>
                <ul style={{ margin: "4px 0 0", paddingLeft: "16px", fontSize: "12.5px", color: INK_SECONDARY }}>
                  {activeChapter.produces.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: "2px" }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Practitioner Statement Creator */}
      {activeTab === "creator" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div
            style={{
              background: "#ffffff",
              border: "1px solid rgba(156,122,47,0.12)",
              borderRadius: "12px",
              padding: "20px",
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr",
              gap: "24px"
            }}
          >
            {/* Form Section */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "left" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                Select statement fields (Bloom: Create):
              </span>

              {/* Field 1 */}
              <div>
                <label style={{ fontSize: "11.5px", fontWeight: "bold", color: INK_SECONDARY, display: "block", marginBottom: "4px" }}>
                  1. Context of Application:
                </label>
                <select
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.25)", outline: "none", fontSize: "13px", background: "#ffffff", color: INK_PRIMARY }}
                >
                  <option value="Professional consultations for annual forecasting">Professional consultations for annual forecasting</option>
                  <option value="Corporate business & timing advice clients">Corporate business & timing advice clients</option>
                  <option value="Classical research, translations, and scholarly writing">Classical research, translations, and scholarly writing</option>
                  <option value="Self-study and personal yearly mapping">Self-study and personal yearly mapping</option>
                </select>
              </div>

              {/* Field 2 */}
              <div>
                <label style={{ fontSize: "11.5px", fontWeight: "bold", color: INK_SECONDARY, display: "block", marginBottom: "4px" }}>
                  2. Framework Elements:
                </label>
                <select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.25)", outline: "none", fontSize: "13px", background: "#ffffff", color: INK_PRIMARY }}
                >
                  <option value="Full M19 toolkit (16 Yogas, 50 Sahams, Varṣaphala, Praśna)">Full M19 toolkit (16 Yogas, 50 Sahams, Varṣaphala, Praśna)</option>
                  <option value="Varṣaphala core mechanics (Munthā, Varṣeśa, and key Sahams)">Varṣaphala core mechanics (Munthā, Varṣeśa, and key Sahams)</option>
                  <option value="Tājika Yogas & aspect-based Praśna horary calculations">Tājika Yogas & aspect-based Praśna horary calculations</option>
                </select>
              </div>

              {/* Field 3 */}
              <div>
                <label style={{ fontSize: "11.5px", fontWeight: "bold", color: INK_SECONDARY, display: "block", marginBottom: "4px" }}>
                  3. Ethical Discipline:
                </label>
                <select
                  value={ethics}
                  onChange={(e) => setEthics(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.25)", outline: "none", fontSize: "13px", background: "#ffffff", color: INK_PRIMARY }}
                >
                  <option value="Bidirectional honest-handling (refusing mystification/scoffing) & two-layer holding">Bidirectional honest-handling (refusing mystification/scoffing) & two-layer holding</option>
                  <option value="Non-fatalistic reframes of separating aspects & client autonomy protection">Non-fatalistic reframes of separating aspects & client autonomy protection</option>
                  <option value="Complete ethical mapping (avoid fear-induction, refuse over-promises)">Complete ethical mapping (avoid fear-induction, refuse over-promises)</option>
                </select>
              </div>

              {/* Field 4 */}
              <div>
                <label style={{ fontSize: "11.5px", fontWeight: "bold", color: INK_SECONDARY, display: "block", marginBottom: "4px" }}>
                  4. Cross-Stream Integration:
                </label>
                <select
                  value={integration}
                  onChange={(e) => setIntegration(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.25)", outline: "none", fontSize: "13px", background: "#ffffff", color: INK_PRIMARY }}
                >
                  <option value="Natal-Promise (Parāśarī) × Year-Activation (Tājika) & KP comparison">Natal-Promise (Parāśarī) × Year-Activation (Tājika) & KP comparison</option>
                  <option value="Five-stream decision discipline (Parāśarī/KP/Jaimini/Lal Kitab/Tājika)">Five-stream decision discipline (Parāśarī/KP/Jaimini/Lal Kitab/Tājika)</option>
                  <option value="Independent cross-checks and convergent-verdict confidence mapping">Independent cross-checks and convergent-verdict confidence mapping</option>
                </select>
              </div>

              {/* Field 5 */}
              <div>
                <label style={{ fontSize: "11.5px", fontWeight: "bold", color: INK_SECONDARY, display: "block", marginBottom: "4px" }}>
                  5. Development Commitment:
                </label>
                <select
                  value={development}
                  onChange={(e) => setDevelopment(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.25)", outline: "none", fontSize: "13px", background: "#ffffff", color: INK_PRIMARY }}
                >
                  <option value="Study of Tājika Nīlakaṇṭhī, remaining modules completion, & community practice">Study of Tājika Nīlakaṇṭhī, remaining modules completion, & community practice</option>
                  <option value="Engaging with multi-stream practitioner networks & empirical testing">Engaging with multi-stream practitioner networks & empirical testing</option>
                  <option value="Periodic commitment reviews, classical text studies, & mentoring">Periodic commitment reviews, classical text studies, & mentoring</option>
                </select>
              </div>

              <button
                onClick={handleCompile}
                style={{
                  background: GOLD,
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px",
                  color: "#ffffff",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "14px",
                  marginTop: "10px",
                  boxShadow: "0 2px 6px rgba(156,122,47,0.2)",
                  transition: "all 150ms ease"
                }}
              >
                Compile Discipline Statement
              </button>
            </div>

            {/* Premium Scroll Certificate Preview Section */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
              {!statementCompiled ? (
                <div style={{ border: "2px dashed rgba(156,122,47,0.2)", borderRadius: "8px", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: INK_MUTED, height: "100%" }}>
                  <Award size={48} style={{ opacity: 0.3, marginBottom: "10px" }} />
                  <span style={{ fontSize: "13px", fontWeight: "bold" }}>Awaiting Compilation</span>
                  <p style={{ margin: "4px 0 0", fontSize: "11.5px", textAlign: "center" }}>Fill the options on the left and click compile to view your document.</p>
                </div>
              ) : (
                <div
                  className="gl-surface-twilight-glass"
                  style={{
                    background: "#fcfaf4",
                    border: `2px double ${GOLD}`,
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 4px 16px rgba(156,122,47,0.06)",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    position: "relative"
                  }}
                >
                  <button
                    onClick={handleCopy}
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: GOLD_DEEP,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11px",
                      fontWeight: "bold"
                    }}
                  >
                    {isCopied ? <Check size={14} color={GREEN} /> : <Copy size={14} />}
                    {isCopied ? "Copied" : "Copy"}
                  </button>

                  <div style={{ textAlign: "center", borderBottom: "1.5px solid rgba(156,122,47,0.15)", paddingBottom: "10px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                      Grahvani Doctrinal Statement
                    </span>
                    <h5 style={{ margin: "2px 0 0 0", fontSize: "16px", color: GOLD_DEEP, fontWeight: 700 }}>
                      Tājika Practitioner Commitment
                    </h5>
                  </div>

                  <div style={{ fontSize: "12.5px", display: "flex", flexDirection: "column", gap: "10px", maxHeight: "280px", overflowY: "auto" }}>
                    <div>
                      <strong style={{ color: GOLD_DEEP, fontSize: "11px", textTransform: "uppercase" }}>1. Context:</strong>
                      <p style={{ margin: "2px 0 0 0", color: INK_SECONDARY }}>{context}</p>
                    </div>
                    <div>
                      <strong style={{ color: GOLD_DEEP, fontSize: "11px", textTransform: "uppercase" }}>2. Framework:</strong>
                      <p style={{ margin: "2px 0 0 0", color: INK_SECONDARY }}>{framework}</p>
                    </div>
                    <div>
                      <strong style={{ color: GOLD_DEEP, fontSize: "11px", textTransform: "uppercase" }}>3. Ethics:</strong>
                      <p style={{ margin: "2px 0 0 0", color: INK_SECONDARY }}>{ethics}</p>
                    </div>
                    <div>
                      <strong style={{ color: GOLD_DEEP, fontSize: "11px", textTransform: "uppercase" }}>4. Integration:</strong>
                      <p style={{ margin: "2px 0 0 0", color: INK_SECONDARY }}>{integration}</p>
                    </div>
                    <div>
                      <strong style={{ color: GOLD_DEEP, fontSize: "11px", textTransform: "uppercase" }}>5. Ongoing:</strong>
                      <p style={{ margin: "2px 0 0 0", color: INK_SECONDARY }}>{development}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Curriculum Completion Roadmap */}
      {activeTab === "roadmap" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ background: "#ffffff", border: "1px solid rgba(156,122,47,0.12)", borderRadius: "12px", padding: "20px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "14px", textTransform: "uppercase", textAlign: "left" }}>
              Actual Tier-1 Curriculum Completion Roadmap (Honest-Reframing timeline):
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {MODULE_ROADMAP.map((mod) => {
                const isComplete = mod.status === "complete";
                return (
                  <div
                    key={mod.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: isComplete ? "rgba(47, 125, 85, 0.03)" : "rgba(217, 119, 6, 0.02)",
                      border: `1.5px solid ${isComplete ? "rgba(47,125,85,0.15)" : "rgba(217,119,6,0.15)"}`,
                      borderRadius: "8px",
                      padding: "10px 14px",
                      fontSize: "13px"
                    }}
                  >
                    <div style={{ display: "flex", gap: "12px" }}>
                      <strong style={{ color: isComplete ? GREEN : AMBER }}>{mod.id}</strong>
                      <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>{mod.name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {isComplete ? (
                        <>
                          <CheckCircle2 size={14} color={GREEN} />
                          <span style={{ color: GREEN, fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>
                            Closed / Complete
                          </span>
                        </>
                      ) : (
                        <>
                          <Settings size={14} className="animate-spin" color={AMBER} style={{ animationDuration: "3s" }} />
                          <span style={{ color: AMBER, fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>
                            Pending Sequential Remediation
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
