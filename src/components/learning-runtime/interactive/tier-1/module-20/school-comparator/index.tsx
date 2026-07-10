"use client";

import { useState } from "react";
import { Table, Eye, CheckCircle2, AlertTriangle, HelpCircle, RefreshCw } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";
const SURFACE = "#FAF6EB";
const HAIRLINE = "rgba(156, 122, 47, 0.15)";

interface SchoolData {
  slug: string;
  name: string;
  sage: string;
  language: string;
  mechanism: string;
  style: string;
  culture: string;
}

const SCHOOLS: SchoolData[] = [
  {
    slug: "vait",
    name: "Vaitheeswarankoil",
    sage: "Maharṣi Agastya",
    language: "Tamil / Vatteluttu script",
    mechanism: "Thumb-print (134 categories) + planetary matching",
    style: "Apprenticeship lineage reading + remedy prescription",
    culture: "Tamil-Shaiva temple community (Tamil Nadu)"
  },
  {
    slug: "chid",
    name: "Chidambaram",
    sage: "Maharṣi Kaushika / Śiva-Vāk",
    language: "Tamil / Grantha script",
    mechanism: "Thumb-print categories + birth data matching",
    style: "Direct lineage services + temple astrological advisory",
    culture: "Tamil-Shaiva / Siddhānta traditional context"
  },
  {
    slug: "hosh",
    name: "Hoshiarpur (Bhṛgu)",
    sage: "Maharṣi Bhṛgu",
    language: "Sanskrit / Devanāgarī",
    mechanism: "Planetary-configuration matching (Lagha/Bhava alignment)",
    style: "Verse-aphoristic reading from extensive Sanskrit files",
    culture: "Punjabi / North-Indian Vedic-Puranic context"
  },
  {
    slug: "kera",
    name: "Kerala",
    sage: "Regional/Fragmented sages",
    language: "Sanskrit / Malayalam script",
    mechanism: "Praśna-kāla (horary moment) + astronomical calculation",
    style: "Brief predictive notes and spiritual guidelines",
    culture: "Kerala temple astrology (Aṣṭamaṅgala Praśna-adjacent)"
  }
];

interface ConflationScenario {
  id: string;
  title: string;
  question: string;
  choices: {
    text: string;
    type: "scoffing" | "mystification" | "balanced";
    feedback: string;
  }[];
}

const CONFLATION_SCENARIOS: ConflationScenario[] = [
  {
    id: "c1",
    title: "Scenario 1: Divergent Readings",
    question: "A client gets a Punjab Bhṛgu reading and then a Tamil Agastya reading. The readings describe two completely different life paths for the same birth chart. The client is upset and asks if one must be a fraud. How do you advise them?",
    choices: [
      {
        text: "Agree that since the readings contradict, one school must be correct and the other is fraudulent.",
        type: "mystification",
        feedback: "Incorrect. This is Mystification. It assumes a 'one-true-school' authority structure and tries to force a hierarchy where none exists."
      },
      {
        text: "Explain that Bhṛgu (Northern Sanskrit) and Agastya (Southern Tamil) are independent regional traditions with separate collections, languages, and starting premises. Divergent outputs are structurally expected, not evidence of fraud.",
        type: "balanced",
        feedback: "Correct! Regional schools have separate custodial histories and different starting assumptions. Divergence is expected."
      },
      {
        text: "Tell the client that all palm-leaf readings are fake anyway, and this contradiction proves it.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing. It uses regional divergence as an excuse to generalize all practitioners as fraudulent, ignoring the documented craft."
      }
    ]
  },
  {
    id: "c2",
    title: "Scenario 2: Method Cross-Importing",
    question: "A learner asks: 'Can we apply the 134 Tamil thumbprint classifications to look up a client's file in the Bhṛgu Saṁhitā library in Hoshiarpur?' How do you instruct them?",
    choices: [
      {
        text: "Yes, thumbprint classification is the universal key used by all palm-leaf and Saṁhitā traditions.",
        type: "mystification",
        feedback: "Incorrect. This is a Conflation Error. Thumbprint mapping is distinctive to Tamil southern lines, whereas northern Bhṛgu matches by planetary configurations."
      },
      {
        text: "No, thumbprint matching is distinctive to the Tamil southern lines. Northern Bhṛgu libraries index by planetary alignments in the birth chart. Applying thumbprints to Bhṛgu is a category cross-importing error.",
        type: "balanced",
        feedback: "Correct! You must respect the distinctive boundaries of each school and avoid cross-importing methods."
      },
      {
        text: "No, because Bhṛgu Saṁhitā doesn't actually have any structured lookup method and is purely random.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing. It denies the documented chart-based indexing system of the Hoshiarpur archives."
      }
    ]
  }
];

export function SchoolComparator() {
  const [activeTab, setActiveTab] = useState<"table" | "dojo">("table");
  const [selectedSchool, setSelectedSchool] = useState<string>("vait");

  // Dojo State
  const [conflationIdx, setConflationIdx] = useState<number>(0);
  const [selectedConflationChoice, setSelectedConflationChoice] = useState<number | null>(null);
  const [showConflationFeedback, setShowConflationFeedback] = useState<boolean>(false);

  const resetDojo = () => {
    setSelectedConflationChoice(null);
    setConflationIdx(0);
    setShowConflationFeedback(false);
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 246, 0.8)",
        border: "1px solid rgba(156, 122, 47, 0.25)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "920px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}
      data-interactive="school-comparator"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 20 — Chapter 1 — Lesson 3
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Regional Schools Comparative Matrix
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Compare the four major regional schools side-by-side, and explore triggers resolving conflations and superiority claims.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1.5px solid rgba(156,122,47,0.1)" }}>
        <button
          onClick={() => setActiveTab("table")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            border: "none",
            background: activeTab === "table" ? "rgba(156, 122, 47, 0.08)" : "none",
            borderBottom: activeTab === "table" ? `3.5px solid ${GOLD}` : "3.5px solid transparent",
            color: activeTab === "table" ? GOLD_DEEP : INK_SECONDARY,
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: activeTab === "table" ? 700 : 500,
            borderRadius: "6px 6px 0 0"
          }}
        >
          <Table size={16} />
          School Comparison Grid
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
          <Eye size={16} />
          Regional Conflation Dojo
        </button>
      </div>

      {/* Scoped CSS Style Injection */}
      <style>{`
        .india-map-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: 1.1fr 1fr;
          margin-bottom: 24px;
        }
        @media (max-width: 820px) {
          .india-map-grid {
            grid-template-columns: 1fr;
          }
        }
        .map-node-card {
          padding: 16px;
          border-radius: 12px;
          background: #FAF6EB;
          border: 1px solid rgba(156, 122, 47, 0.15);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.2s ease-in-out;
        }
      `}</style>

      {activeTab === "table" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Top Row: Map & Details Card */}
          <div className="india-map-grid">
            {/* Left: SVG Transmission Map */}
            <div className="map-node-card relative" style={{ alignItems: "center" }}>
              <span className="self-start text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: GOLD_DEEP }}>
                Geographic Transmission Map
              </span>

              <svg viewBox="0 0 340 360" className="w-full h-auto block" style={{ maxHeight: "360px" }}>
                <defs>
                  <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#9C7A2F" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#9C7A2F" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Styled background map container */}
                <rect x="5" y="5" width="330" height="350" rx="12" fill="#FAF6EB" stroke="rgba(156, 122, 47, 0.12)" strokeWidth="1" />
                
                {/* Stylized outline representing India's geography */}
                <path
                  d="M 120,40 L 150,40 L 160,60 L 180,75 L 185,110 L 220,130 L 210,160 L 230,170 L 200,200 L 180,240 L 160,285 L 150,320 L 140,290 L 115,260 L 95,220 L 90,190 L 80,185 L 85,150 L 110,135 L 105,95 L 110,70 Z"
                  fill="rgba(156, 122, 47, 0.04)"
                  stroke="rgba(156, 122, 47, 0.15)"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />

                {/* Northern Boundary line separating North and South traditions */}
                <line x1="20" y1="170" x2="320" y2="170" stroke="rgba(156, 122, 47, 0.3)" strokeWidth="1.5" strokeDasharray="5 3" />
                <text x="25" y="162" fontSize="9" fontWeight="bold" fill={INK_MUTED} letterSpacing="0.08em">NORTHERN TRADITION (SANSKRIT)</text>
                <text x="25" y="186" fontSize="9" fontWeight="bold" fill={INK_MUTED} letterSpacing="0.08em">SOUTHERN TRADITION (TAMIL)</text>

                {/* Northern Node: Hoshiarpur */}
                <g className="cursor-pointer" onClick={() => setSelectedSchool("hosh")}>
                  <circle cx="130" cy="80" r="30" fill="url(#mapGlow)" />
                  <circle cx="130" cy="80" r="8" fill={selectedSchool === "hosh" ? GOLD : "rgba(156,122,47,0.3)"} stroke={GOLD} strokeWidth="2" style={{ transition: "all 0.2s" }} />
                  <text x="130" y="105" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill={selectedSchool === "hosh" ? GOLD : INK_PRIMARY}>Punjab (Bhṛgu)</text>
                  <text x="130" y="116" textAnchor="middle" fontSize="7.5" fill={INK_SECONDARY}>Sanskrit Chart Index</text>
                </g>

                {/* Southern Node 1: Vaitheeswarankoil */}
                <g className="cursor-pointer" onClick={() => setSelectedSchool("vait")}>
                  <circle cx="160" cy="270" r="30" fill="url(#mapGlow)" />
                  <circle cx="160" cy="270" r="8" fill={selectedSchool === "vait" ? GOLD : "rgba(156,122,47,0.3)"} stroke={GOLD} strokeWidth="2" style={{ transition: "all 0.2s" }} />
                  <text x="205" y="274" textAnchor="start" fontSize="10.5" fontWeight="bold" fill={selectedSchool === "vait" ? GOLD : INK_PRIMARY}>Vaitheeswarankoil</text>
                  <text x="205" y="285" textAnchor="start" fontSize="7.5" fill={INK_SECONDARY}>Tamil Thumbprint</text>
                </g>

                {/* Southern Node 2: Chidambaram */}
                <g className="cursor-pointer" onClick={() => setSelectedSchool("chid")}>
                  <circle cx="150" cy="235" r="22" fill="url(#mapGlow)" />
                  <circle cx="150" cy="235" r="6" fill={selectedSchool === "chid" ? GOLD : "rgba(156,122,47,0.3)"} stroke={GOLD} strokeWidth="1.5" style={{ transition: "all 0.2s" }} />
                  <text x="95" y="233" textAnchor="end" fontSize="10" fontWeight="bold" fill={selectedSchool === "chid" ? GOLD : INK_PRIMARY}>Chidambaram</text>
                  <text x="95" y="244" textAnchor="end" fontSize="7.5" fill={INK_SECONDARY}>Kaushika/Shiva-Vak</text>
                </g>

                {/* Southern Node 3: Kerala */}
                <g className="cursor-pointer" onClick={() => setSelectedSchool("kera")}>
                  <circle cx="120" cy="285" r="22" fill="url(#mapGlow)" />
                  <circle cx="120" cy="285" r="6" fill={selectedSchool === "kera" ? GOLD : "rgba(156,122,47,0.3)"} stroke={GOLD} strokeWidth="1.5" style={{ transition: "all 0.2s" }} />
                  <text x="110" y="312" textAnchor="middle" fontSize="10" fontWeight="bold" fill={selectedSchool === "kera" ? GOLD : INK_PRIMARY}>Kerala</text>
                  <text x="110" y="323" textAnchor="middle" fontSize="7.5" fill={INK_SECONDARY}>Horary / Malayalam</text>
                </g>
              </svg>
            </div>

            {/* Right: Detail Card */}
            <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
              {(() => {
                const schoolObj = SCHOOLS.find((s) => s.slug === selectedSchool) || SCHOOLS[0];
                return (
                  <div className="flex flex-col h-full justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between border-b pb-2 mb-3">
                        <h4 className="m-0 text-lg font-bold" style={{ color: GOLD_DEEP }}>
                          {schoolObj.name}
                        </h4>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100/50" style={{ color: GOLD_DEEP }}>
                          {schoolObj.slug === "hosh" ? "Northern" : "Southern"}
                        </span>
                      </div>
                      <div className="space-y-3 text-xs">
                        <p className="m-0">
                          <strong className="block uppercase text-[9px] tracking-wider mb-0.5" style={{ color: INK_MUTED }}>Sage Attribution:</strong>
                          <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>{schoolObj.sage}</span>
                        </p>
                        <p className="m-0">
                          <strong className="block uppercase text-[9px] tracking-wider mb-0.5" style={{ color: INK_MUTED }}>Language & Script:</strong>
                          <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>{schoolObj.language}</span>
                        </p>
                        <p className="m-0">
                          <strong className="block uppercase text-[9px] tracking-wider mb-0.5" style={{ color: INK_MUTED }}>Lookup Indexing Method:</strong>
                          <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>{schoolObj.mechanism}</span>
                        </p>
                        <p className="m-0">
                          <strong className="block uppercase text-[9px] tracking-wider mb-0.5" style={{ color: INK_MUTED }}>Consultation Style:</strong>
                          <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>{schoolObj.style}</span>
                        </p>
                        <p className="m-0">
                          <strong className="block uppercase text-[9px] tracking-wider mb-0.5" style={{ color: INK_MUTED }}>Cultural Context:</strong>
                          <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>{schoolObj.culture}</span>
                        </p>
                      </div>
                    </div>
                    <p className="m-0 text-[11px] italic" style={{ color: INK_SECONDARY, borderLeft: `2.5px solid ${GOLD}`, paddingLeft: "8px" }}>
                      *Note: Each regional school operates independent manuscript archives. Divergent readings are structurally expected.
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Full Reference Table underneath */}
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid rgba(156, 122, 47, 0.15)",
                fontSize: "13px"
              }}
            >
              <thead>
                <tr style={{ background: "rgba(156, 122, 47, 0.08)", borderBottom: "2px solid rgba(156, 122, 47, 0.2)" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: GOLD_DEEP, fontWeight: 700 }}>School</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: GOLD_DEEP, fontWeight: 700 }}>Sage Attributed</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: GOLD_DEEP, fontWeight: 700 }}>Language / Lipi</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: GOLD_DEEP, fontWeight: 700 }}>ID Mechanism</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: GOLD_DEEP, fontWeight: 700 }}>Style</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: GOLD_DEEP, fontWeight: 700 }}>Culture</th>
                </tr>
              </thead>
              <tbody>
                {SCHOOLS.map((school, idx) => (
                  <tr
                    key={school.slug}
                    className="cursor-pointer hover:bg-amber-50/20"
                    onClick={() => setSelectedSchool(school.slug)}
                    style={{
                      borderBottom: idx === SCHOOLS.length - 1 ? "none" : "1px solid rgba(156, 122, 47, 0.1)",
                      background: school.slug === selectedSchool ? "rgba(156, 122, 47, 0.05)" : idx % 2 === 1 ? "rgba(255, 253, 246, 0.3)" : "#fff",
                      transition: "all 0.2s"
                    }}
                  >
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: INK_PRIMARY }}>{school.name}</td>
                    <td style={{ padding: "12px 16px", color: INK_SECONDARY }}>{school.sage}</td>
                    <td style={{ padding: "12px 16px", color: INK_SECONDARY }}>{school.language}</td>
                    <td style={{ padding: "12px 16px", color: INK_SECONDARY }}>{school.mechanism}</td>
                    <td style={{ padding: "12px 16px", color: INK_SECONDARY }}>{school.style}</td>
                    <td style={{ padding: "12px 16px", color: INK_SECONDARY }}>{school.culture}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", minHeight: "300px" }}>
          <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                {CONFLATION_SCENARIOS[conflationIdx].title}
              </span>
              <span style={{ fontSize: "11px", color: INK_MUTED }}>
                {conflationIdx + 1} of {CONFLATION_SCENARIOS.length}
              </span>
            </div>

            <p style={{ fontSize: "14.5px", color: INK_PRIMARY, fontWeight: 600, margin: "0 0 20px" }}>
              {CONFLATION_SCENARIOS[conflationIdx].question}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {CONFLATION_SCENARIOS[conflationIdx].choices.map((c, idx) => {
                const isSelected = selectedConflationChoice === idx;
                let borderColor = "rgba(156, 122, 47, 0.25)";
                let bg = "#fff";
                if (showConflationFeedback && isSelected) {
                  borderColor = c.type === "balanced" ? GREEN : RED;
                  bg = c.type === "balanced" ? "rgba(47,125,85,0.06)" : "rgba(162,58,30,0.06)";
                } else if (isSelected) {
                  borderColor = GOLD;
                  bg = "rgba(156,122,47,0.04)";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedConflationChoice(idx);
                      setShowConflationFeedback(true);
                    }}
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

            {showConflationFeedback && selectedConflationChoice !== null && (
              <div style={{ marginTop: "20px" }}>
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    background: CONFLATION_SCENARIOS[conflationIdx].choices[selectedConflationChoice].type === "balanced" ? "rgba(47, 125, 85, 0.05)" : "rgba(162, 58, 30, 0.05)",
                    border: `1px solid ${CONFLATION_SCENARIOS[conflationIdx].choices[selectedConflationChoice].type === "balanced" ? GREEN : RED}`,
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start"
                  }}
                >
                  {CONFLATION_SCENARIOS[conflationIdx].choices[selectedConflationChoice].type === "balanced" ? (
                    <CheckCircle2 size={20} style={{ color: GREEN, flexShrink: 0 }} />
                  ) : (
                    <AlertTriangle size={20} style={{ color: RED, flexShrink: 0 }} />
                  )}
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 700, color: CONFLATION_SCENARIOS[conflationIdx].choices[selectedConflationChoice].type === "balanced" ? GREEN : RED }}>
                      {CONFLATION_SCENARIOS[conflationIdx].choices[selectedConflationChoice].type === "balanced" ? "CORRECT DISCERNMENT" : "CONFLATION WARNING"}
                    </h4>
                    <p style={{ margin: 0, fontSize: "13.5px", color: INK_PRIMARY, lineHeight: "1.45" }}>
                      {CONFLATION_SCENARIOS[conflationIdx].choices[selectedConflationChoice].feedback}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                  {conflationIdx < CONFLATION_SCENARIOS.length - 1 ? (
                    <button
                      onClick={() => {
                        setShowConflationFeedback(false);
                        setSelectedConflationChoice(null);
                        setConflationIdx((prev) => prev + 1);
                      }}
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
