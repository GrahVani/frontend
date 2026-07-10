"use client";

import React, { useState, useCallback } from "react";
import {
  BookOpen, Layers, CheckCircle2, AlertCircle, Compass,
  ArrowRight, GitFork, Info, RotateCcw, Smile
} from "lucide-react";

// Slate blue, indigo, and ivory color tokens
const STEEL_BLUE = "#365c7a";
const STEEL_DEEP = "#21394c";
const STEEL_LIGHT = "rgba(54, 92, 122, 0.05)";
const STEEL_BORDER = "rgba(54, 92, 122, 0.18)";
const GREEN = "#4e7037";
const GREEN_LIGHT = "rgba(78, 112, 55, 0.06)";
const RED = "#ad4b37";
const RED_LIGHT = "rgba(173, 75, 55, 0.05)";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";

interface ReaderBook {
  vol: string;
  title: string;
  devanagari: string;
  color: string;
  topic: string;
  contribution: string;
  prerequisites: string[];
}

const READERS: ReaderBook[] = [
  {
    vol: "I",
    title: "Reader I: Astrology & Castings",
    devanagari: "रीडर १: ज्योतिष एवं कुण्डली रचना",
    color: "#2e4a62",
    topic: "Cusps + Ayanāṁśa fundamentals.",
    contribution: "Introduces the Placidus quadrant-based house system and the sidereal zodiac's KP-specific ayanāṁśa. Lays the mathematical groundwork.",
    prerequisites: []
  },
  {
    vol: "II",
    title: "Reader II: Sub-Lord Theory",
    devanagari: "रीडर २: उप-स्वामी सिद्धान्त",
    color: "#385b75",
    topic: "Zodiac sub-divisions and sub-lord signature doctrine.",
    contribution: "Detailing the 249 sub-divisions ( nakṣatras × Vimśottarī proportions) and the cuspal-sub-lord (CSL) foundation. This is KP's analytical signature.",
    prerequisites: ["Reader I"]
  },
  {
    vol: "III",
    title: "Reader III: Planetary Significators",
    devanagari: "रीडर ३: ग्रहीय कारकत्व",
    color: "#426b89",
    topic: "Significator-identification procedures.",
    contribution: "Establishing planetary significators, house significators, and strict determination rules to identify active planets for any event query.",
    prerequisites: ["Reader II"]
  },
  {
    vol: "IV",
    title: "Reader IV: Practical Worked Cases",
    devanagari: "रीडर ४: व्यावहारिक कुण्डली विश्लेषण",
    color: "#4d7c9d",
    topic: "Applied client worked examples.",
    contribution: "Integrates worked case files demonstrating significator-chain analysis, verification, and timing checks under real consultative conditions.",
    prerequisites: ["Reader III"]
  },
  {
    vol: "V",
    title: "Reader V: Vimśottarī Adaptation",
    devanagari: "रीडर ५: विंशोत्तरी काल-चक्र",
    color: "#5b8cb0",
    topic: "KP-modified Vimśottarī period calculations.",
    contribution: "Adapts the traditional 120-year Vimśottarī daśā and bhukti sub-periods by overlaying the sub-lord doctrine for high-precision temporal timing.",
    prerequisites: ["Reader II", "Reader III"]
  },
  {
    vol: "VI",
    title: "Reader VI: Horary & Ruling Planets",
    devanagari: "रीडर ६: प्रश्न-कुण्डली एवं शासक-ग्रह",
    color: "#6aa0c4",
    topic: "KP horary judgment and timing via ruling planets.",
    contribution: "The peak of the system. Explains the momental-question horary framework (using number selection 1–249) and timing via Ruling Planets (RPs).",
    prerequisites: ["Reader II", "Reader III", "Reader V"]
  }
];

export function KPReaderSeriesExplorer() {
  const [activeTab, setActiveTab] = useState<"explorer" | "sequencer" | "authority">("explorer");
  const [selectedVolIdx, setSelectedVolIdx] = useState<number>(1); // Default to Reader II (signature)
  const [showDependencies, setShowDependencies] = useState<boolean>(false);
  const [showLineageLayer, setShowLineageLayer] = useState<boolean>(false);

  // Sequencer quiz state
  const [randomizedOrder, setRandomizedOrder] = useState<ReaderBook[]>(() => {
    // Generate simple randomized order
    return [...READERS].sort(() => Math.random() - 0.5);
  });
  const [assembledOrder, setAssembledOrder] = useState<ReaderBook[]>([]);
  const [sequencerFeedback, setSequencerFeedback] = useState<string | null>(null);
  const [sequencerSubmitted, setSequencerSubmitted] = useState<boolean>(false);

  // Authority matrix self-check
  const [authSelected, setAuthSelected] = useState<string | null>(null);
  const [authSubmitted, setAuthSubmitted] = useState<boolean>(false);
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);

  const selectedReader = READERS[selectedVolIdx];

  // Sequencer Click handler
  const handleSelectBookInQuiz = (book: ReaderBook) => {
    if (sequencerSubmitted) return;
    if (assembledOrder.some(b => b.vol === book.vol)) {
      setAssembledOrder(prev => prev.filter(b => b.vol !== book.vol));
      setSequencerFeedback(null);
    } else {
      setAssembledOrder(prev => [...prev, book]);
      setSequencerFeedback(null);
    }
  };

  const handleVerifySequence = () => {
    setSequencerSubmitted(true);
    if (assembledOrder.length !== READERS.length) {
      setSequencerFeedback("Incorrect. You must place all 6 readers in the list.");
      return;
    }
    const isCorrect = assembledOrder.every((b, idx) => b.vol === READERS[idx].vol);
    if (isCorrect) {
      setSequencerFeedback("Correct! You have sequenced the Reader Series in its exact pedagogical order (I ➔ II ➔ III ➔ IV ➔ V ➔ VI). Each book progressive builds upon the last.");
    } else {
      setSequencerFeedback("Incorrect order. Hint: You must cast the cusp (I) before defining sub-lords (II), finding significators (III), checking case files (IV), calculating periods (V), and answering horary (VI).");
    }
  };

  const handleResetQuiz = () => {
    setRandomizedOrder([...READERS].sort(() => Math.random() - 0.5));
    setAssembledOrder([]);
    setSequencerSubmitted(false);
    setSequencerFeedback(null);
  };

  const handleVerifyAuthority = () => {
    if (!authSelected) return;
    setAuthSubmitted(true);
    if (authSelected === "opt2") {
      setAuthFeedback("Correct! KP's authority rests on founding-author (Krishnamurti) systematization, followed by commentarial lineage validation (Bosmia, Subramaniam, Sharma) and multi-decadal practitioner verification. This represents an actively-systematizing community pathway rather than ancient canonical consensus.");
    } else if (authSelected === "opt1") {
      setAuthFeedback("Incorrect. Sage Parāśara is the source of classical Parāśarī, not the 20th-century KP stream.");
    } else {
      setAuthFeedback("Incorrect. Grahvani's framework embraces hybrid absorption (like Western horary) as a legitimate evolutionary feature rather than a disqualifying factor.");
    }
  };

  return (
    <div style={{
      padding: "20px",
      borderRadius: "16px",
      background: "rgba(255, 253, 248, 0.80)",
      backdropFilter: "blur(14px)",
      border: `1px solid ${STEEL_BORDER}`,
      fontFamily: "'Inter', sans-serif",
      color: INK_PRIMARY,
      maxWidth: "980px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "18px"
    }}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        
        .kpr-nav-btn {
          border: none; background: transparent; cursor: pointer; padding: 8px 16px;
          border-radius: 8px; font-size: 11.5px; font-weight: 700; color: ${INK_MUTED};
          transition: all 0.2s ease;
        }
        .kpr-nav-btn:hover { color: ${STEEL_BLUE}; background: rgba(54, 92, 122, 0.04); }
        .kpr-nav-btn.active { background: rgba(54, 92, 122, 0.08); color: ${STEEL_BLUE}; }

        .book-spine {
          cursor: pointer; padding: 8px 12px; border-radius: 6px;
          color: #ffffff; font-weight: 700; font-size: 11.5px;
          display: flex; align-items: center; justify-content: space-between;
          box-shadow: 0 2px 5px rgba(0,0,0,0.12);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .book-spine:hover { transform: translateX(4px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        .book-spine.selected { transform: scale(1.03) translateX(8px); box-shadow: 0 4px 10px rgba(54, 92, 122, 0.3); border: 2px solid ${STEEL_BLUE}; }

        .prereq-badge {
          background: rgba(173, 75, 55, 0.08); color: #ad4b37;
          border: 1px solid rgba(173, 75, 55, 0.2);
          font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px;
        }
        .seq-pill {
          background: #ffffff; border: 1.5px solid rgba(54, 92, 122, 0.15);
          padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 11px;
          color: ${INK_SECONDARY}; transition: all 0.2s ease; text-align: center;
          font-weight: 700;
        }
        .seq-pill:hover:not(.submitted) { border-color: ${STEEL_BLUE}; background: ${STEEL_LIGHT}; }
        .seq-pill.selected { border-color: ${STEEL_BLUE}; background: rgba(54, 92, 122, 0.08); color: ${STEEL_BLUE}; }

        .matrix-card {
          background: #ffffff; border: 1.5px solid rgba(54, 92, 122, 0.12);
          border-radius: 12px; padding: 14px; flex: 1; display: flex; flex-direction: column; gap: 8px;
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ borderBottom: "1px solid rgba(54, 92, 122, 0.12)", paddingBottom: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: STEEL_DEEP, display: "flex", alignItems: "center", gap: "8px" }}>
            <BookOpen size={18} />
            The KP Reader Series Explorer
          </h3>
          <span style={{ fontSize: "11px", fontWeight: 700, color: STEEL_BLUE, fontStyle: "italic" }}>
            के. पी. रीडर शृंखला
          </span>
        </div>
        <p style={{ margin: "4px 0 0 0", fontSize: "11.5px", color: INK_SECONDARY, lineHeight: "1.45" }}>
          Examine the 6-volume canonical books authored by K.S. Krishnamurti and understand how they build a progressive analytical ladder.
        </p>
      </div>

      {/* ── NAV SWITCHER ── */}
      <div style={{ display: "flex", gap: "4px", background: "rgba(54, 92, 122, 0.03)", borderRadius: "10px", padding: "3px" }}>
        <button onClick={() => setActiveTab("explorer")} className={`kpr-nav-btn ${activeTab === "explorer" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Layers size={13} /> Reader Stack Diorama</span>
        </button>
        <button onClick={() => setActiveTab("sequencer")} className={`kpr-nav-btn ${activeTab === "sequencer" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><BookOpen size={13} /> Study Sequencer Quiz</span>
        </button>
        <button onClick={() => setActiveTab("authority")} className={`kpr-nav-btn ${activeTab === "authority" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><GitFork size={13} /> Authority Matrix</span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 1: BOOK STACK DIORAMA                                */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "explorer" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "slideIn 0.3s ease" }}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {/* Left Column: Interactive Bookcase */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: "1.2", minWidth: "290px" }}>
              <div style={{ background: "rgba(253, 246, 227, 0.3)", border: `1.5px solid ${STEEL_BORDER}`, borderRadius: "12px", padding: "12px" }}>
                <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>
                  1. Select a Volume from the Classical Bookcase
                </span>
                <div style={{ position: "relative", width: "100%", height: "165px", overflow: "hidden" }}>
                  <svg viewBox="0 0 600 165" style={{ width: "100%", height: "100%" }} role="img" aria-label="KP Bookcase">
                    {/* Wooden shelf structure */}
                    <rect x="10" y="140" width="580" height="15" rx="4" fill="#8d5b4c" stroke="#5c3a2f" strokeWidth="2" />
                    <rect x="20" y="5" width="10" height="135" fill="#7a4e41" />
                    <rect x="570" y="5" width="10" height="135" fill="#7a4e41" />
                    
                    {/* Books on shelf */}
                    {READERS.map((book, idx) => {
                      const isActive = selectedVolIdx === idx;
                      const x = 50 + idx * 84;
                      const y = isActive ? 12 : 28;
                      const h = 112;
                      const w = 72;
                      return (
                        <g key={book.vol} onClick={() => setSelectedVolIdx(idx)} style={{ cursor: "pointer" }}>
                          {/* Book shadow */}
                          <rect x={x + 3} y={y + 3} width={w} height={h} rx="2" fill="rgba(0,0,0,0.12)" style={{ transition: "all 0.25s ease" }} />
                          {/* Book cover */}
                          <rect x={x} y={y} width={w} height={h} rx="2" fill={book.color} stroke={isActive ? "#dca134" : "rgba(255,255,255,0.15)"} strokeWidth={isActive ? 2.5 : 1} style={{ transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)" }} />
                          {/* Gold foil lines on cover */}
                          <line x1={x + 6} y1={y} x2={x + 6} y2={y + h} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                          <line x1={x + w - 6} y1={y} x2={x + w - 6} y2={y + h} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                          
                          {/* Label holder */}
                          <rect x={x + w/2 - 16} y={y + 10} width="32" height="18" rx="2" fill="rgba(255,255,255,0.2)" />
                          <text x={x + w/2} y={y + 22} textAnchor="middle" fill="#ffffff" fontSize="9px" fontWeight="900">Vol {book.vol}</text>
                          
                          {/* Title (Vertically aligned) */}
                          <g transform={`translate(${x + w/2 + 3}, ${y + 70}) rotate(-90)`}>
                            <text x="0" y="0" textAnchor="middle" fill="#ffffff" fontSize="8.5px" fontWeight="700" letterSpacing="0.1px">
                              {book.title.split(": ")[1] ? book.title.split(": ")[1].substring(0, 13) : book.title.substring(0, 13)}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
              
              {/* Actions row */}
              <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                <button
                  onClick={() => setShowDependencies(prev => !prev)}
                  style={{
                    border: `1.5px solid ${STEEL_BLUE}`, background: "transparent",
                    color: STEEL_BLUE, padding: "8px 12px", borderRadius: "8px", cursor: "pointer",
                    fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px"
                  }}
                >
                  <GitFork size={13} /> {showDependencies ? "Hide Dependencies" : "Show Dependencies"}
                </button>
                <button
                  onClick={() => setShowLineageLayer(prev => !prev)}
                  style={{
                    border: `1.5px solid ${GREEN}`, background: "transparent",
                    color: GREEN, padding: "8px 12px", borderRadius: "8px", cursor: "pointer",
                    fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px"
                  }}
                >
                  <Compass size={13} /> {showLineageLayer ? "Hide Lineage Timeline" : "Show Lineage Layer"}
                </button>
              </div>
            </div>

            {/* Right Column: Detailed Reader Info Card */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: "1.3", minWidth: "320px" }}>
              <div style={{
                background: "#ffffff", border: `1.5px solid ${STEEL_BLUE}`, borderRadius: "14px", padding: "16px",
                display: "flex", flexDirection: "column", gap: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                animation: "slideIn 0.25s ease", height: "100%"
              }}>
                <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px dashed rgba(54,92,122,0.2)", paddingBottom: "6px" }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "13.5px", fontWeight: 800, color: STEEL_DEEP }}>
                      {selectedReader.title}
                    </h4>
                    <span style={{ fontSize: "10px", color: INK_MUTED, fontStyle: "italic" }}>
                      {selectedReader.devanagari}
                    </span>
                  </div>
                  <span style={{
                    background: selectedReader.color, color: "#fff", padding: "4px 8px", borderRadius: "6px",
                    fontSize: "10px", fontWeight: 800
                  }}>
                    Vol {selectedReader.vol}
                  </span>
                </div>

                <div style={{ fontSize: "11.5px", color: INK_PRIMARY, lineHeight: "1.45" }}>
                  <strong style={{ color: STEEL_BLUE }}>Topic Coverage:</strong> {selectedReader.topic}
                </div>

                <div style={{
                  background: STEEL_LIGHT, padding: "10px", borderRadius: "8px",
                  borderLeft: `3.5px solid ${selectedReader.color}`, fontSize: "11px", lineHeight: "1.5", color: INK_SECONDARY
                }}>
                  <strong style={{ color: STEEL_DEEP }}>Doctrinal Contribution:</strong> {selectedReader.contribution}
                </div>

                {/* Dependency visualization overlay */}
                {showDependencies && (
                  <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px", animation: "slideIn 0.2s ease" }}>
                    <span style={{ fontSize: "9.5px", fontWeight: 800, color: STEEL_BLUE, textTransform: "uppercase" }}>Pedagogical Prerequisites:</span>
                    {selectedReader.prerequisites.length > 0 ? (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {selectedReader.prerequisites.map(p => (
                          <span key={p} className="prereq-badge">Requires {p}</span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: "10.5px", color: "#4e7037", fontWeight: 700 }}>✦ Foundational Volume (No Astrological Prerequisites)</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Commentators & Lineage Layer */}
          {showLineageLayer && (
            <div style={{
              width: "100%", marginTop: "14px", padding: "16px", borderRadius: "12px",
              background: "#ffffff", border: `1.5px solid ${GREEN}`, animation: "slideIn 0.3s ease",
              display: "flex", flexDirection: "column", gap: "12px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1.5px dashed ${GREEN}`, paddingBottom: "6px" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: GREEN, letterSpacing: "0.5px" }}>
                  Modern Lineage Layer & Authority Hand-off (§4.3)
                </span>
                <span style={{ fontSize: "10px", color: INK_MUTED, fontStyle: "italic" }}>
                  Late 20th C. ➔ Present
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.45" }}>
                Following the founder's passing in 1972, KP's authority shifted from a single founding author to an active commentarial and empirical-verification framework sustained by his student lineage.
              </p>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "space-between", position: "relative", padding: "10px 0" }}>
                <div style={{
                  position: "absolute", left: "20px", right: "20px", height: "2px",
                  background: `linear-gradient(to right, ${STEEL_BLUE}, ${GREEN})`, top: "35px", zIndex: 1
                }} />

                {/* Node 1: Founder passing */}
                <div style={{ position: "relative", zIndex: 2, background: "#ffffff", border: `1px solid ${STEEL_BORDER}`, padding: "8px 12px", borderRadius: "8px", flex: "1", minWidth: "150px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: STEEL_DEEP }}>1972</div>
                  <div style={{ fontSize: "10.5px", fontWeight: 700, color: STEEL_BLUE, marginTop: "2px" }}>Founder passing</div>
                  <div style={{ fontSize: "10px", color: INK_SECONDARY, marginTop: "4px" }}>Authority hand-off to peer validation and student commentary.</div>
                </div>

                {/* Node 2: Bosmia */}
                <div style={{ position: "relative", zIndex: 2, background: "#ffffff", border: `1.5px solid ${GREEN}`, padding: "8px 12px", borderRadius: "8px", flex: "1.2", minWidth: "200px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#4e7037" }}>Bosmia</div>
                  <div style={{ fontSize: "10.5px", fontWeight: 700, color: GREEN, marginTop: "2px" }}>Case Verification</div>
                  <div style={{ fontSize: "10px", color: INK_SECONDARY, marginTop: "4px" }}>Compiled comprehensive client charts to verify sub-lord triggers and significators.</div>
                </div>

                {/* Node 3: Subramaniam */}
                <div style={{ position: "relative", zIndex: 2, background: "#ffffff", border: `1.5px solid ${GREEN}`, padding: "8px 12px", borderRadius: "8px", flex: "1.2", minWidth: "200px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#4e7037" }}>Subramaniam</div>
                  <div style={{ fontSize: "10.5px", fontWeight: 700, color: GREEN, marginTop: "2px" }}>Pedagogical Math</div>
                  <div style={{ fontSize: "10px", color: INK_SECONDARY, marginTop: "4px" }}>Simplified the mathematical boundaries and tables of the 249 sub-divisions.</div>
                </div>

                {/* Node 4: Sharma */}
                <div style={{ position: "relative", zIndex: 2, background: "#ffffff", border: `1.5px solid ${GREEN}`, padding: "8px 12px", borderRadius: "8px", flex: "1.2", minWidth: "200px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#4e7037" }}>Sharma</div>
                  <div style={{ fontSize: "10.5px", fontWeight: 700, color: GREEN, marginTop: "2px" }}>Federation & RP</div>
                  <div style={{ fontSize: "10px", color: INK_SECONDARY, marginTop: "4px" }}>Managed federation journals, expanded Ruling Planets horary tracking.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 2: STUDY SEQUENCER QUIZ                              */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "sequencer" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "slideIn 0.3s ease" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
              2. Sequence the Books in Proper Pedagogical Study Order
            </span>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.45" }}>
              Click on the volumes below in their correct study sequence (from fundamental charts to horary).
            </p>
          </div>

          {/* Random Book list */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            {randomizedOrder.map((book) => {
              const isSelected = assembledOrder.some(b => b.vol === book.vol);
              return (
                <button
                  key={book.vol}
                  disabled={sequencerSubmitted}
                  onClick={() => handleSelectBookInQuiz(book)}
                  className={`seq-pill ${isSelected ? "selected" : ""} ${sequencerSubmitted ? "submitted" : ""}`}
                >
                  Vol {book.vol}
                </button>
              );
            })}
          </div>

          {/* Assembly Line */}
          <div style={{
            background: "#ffffff", border: `1.5px dashed ${STEEL_BLUE}`, borderRadius: "10px",
            padding: "14px", minHeight: "60px", display: "flex", flexDirection: "column", gap: "6px"
          }}>
            <span style={{ fontSize: "9.5px", fontWeight: 800, color: STEEL_BLUE, textTransform: "uppercase" }}>Your Assembled Sequence:</span>
            {assembledOrder.length > 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                {assembledOrder.map((b, idx) => (
                  <React.Fragment key={b.vol}>
                    <div style={{
                      background: b.color, color: "#fff", fontSize: "10.5px", fontWeight: 800,
                      padding: "4px 8px", borderRadius: "4px"
                    }}>
                      Vol {b.vol}
                    </div>
                    {idx < assembledOrder.length - 1 && <ArrowRight size={10} style={{ color: INK_MUTED }} />}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: "11px", color: INK_MUTED, fontStyle: "italic" }}>
                Click the pills above in sequence to assemble your curriculum hierarchy.
              </span>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleVerifySequence}
              disabled={assembledOrder.length === 0}
              style={{
                border: "none", background: STEEL_BLUE, color: "#fff", padding: "8px 18px",
                borderRadius: "6px", fontSize: "11px", fontWeight: 750, cursor: "pointer",
                opacity: assembledOrder.length > 0 ? 1 : 0.5
              }}
            >
              Verify Sequence
            </button>
            <button
              onClick={handleResetQuiz}
              style={{
                border: `1px solid ${STEEL_BLUE}`, background: "transparent", color: STEEL_BLUE,
                padding: "8px 14px", borderRadius: "6px", fontSize: "11px", fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Reset Quiz
            </button>
          </div>

          {/* Quiz Feedback */}
          {sequencerSubmitted && sequencerFeedback && (
            <div style={{
              background: sequencerFeedback.startsWith("Correct") ? GREEN_LIGHT : RED_LIGHT,
              borderLeft: `3px solid ${sequencerFeedback.startsWith("Correct") ? "#4e7037" : "#ad4b37"}`,
              padding: "10px", borderRadius: "0 8px 8px 0", fontSize: "11px", lineHeight: "1.45",
              color: sequencerFeedback.startsWith("Correct") ? "#344e24" : "#762e21",
              animation: "slideIn 0.25s ease"
            }}>
              {sequencerFeedback.startsWith("Correct") ? <Smile size={14} style={{ display: "inline-block", marginRight: "6px", verticalAlign: "middle" }} /> : <AlertCircle size={14} style={{ display: "inline-block", marginRight: "6px", verticalAlign: "middle" }} />}
              <strong>{sequencerFeedback.startsWith("Correct") ? "Passed!" : "Try again."}</strong> {sequencerFeedback}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: AUTHORITY BASIS MATRIX ── */}
      {activeTab === "authority" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "slideIn 0.3s ease" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
              3. Authority Basis Comparison (§4.2)
            </span>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.45" }}>
              KP operates on a modern-systematized authority model that differs structurally from ancient Sanskrit traditions. Both are legitimate via distinct epistemic paths.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {/* KP basis */}
            <div className="matrix-card" style={{ borderLeft: `3.5px solid ${STEEL_BLUE}` }}>
              <strong style={{ fontSize: "12px", color: STEEL_DEEP, display: "flex", alignItems: "center", gap: "4px" }}>
                <span>✦</span> KP stream authority model
              </strong>
              <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "10.5px", color: INK_SECONDARY, display: "flex", flexDirection: "column", gap: "4px" }}>
                <li><strong>Age:</strong> ~60 years of canonical literature (since 1960s).</li>
                <li><strong>Type:</strong> Founding-author authority (Krishnamurti) + commentarial lineage (Bosmia, Subramaniam, Sharma).</li>
                <li><strong>Validation:</strong> Actively-systematizing practitioner community + empirical timing tracking.</li>
              </ul>
            </div>

            {/* Parashari basis */}
            <div className="matrix-card" style={{ borderLeft: `3.5px solid #4e7037` }}>
              <strong style={{ fontSize: "12px", color: "#4e7037", display: "flex", alignItems: "center", gap: "4px" }}>
                <span>✓</span> Parāśarī stream authority model
              </strong>
              <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "10.5px", color: INK_SECONDARY, display: "flex", flexDirection: "column", gap: "4px" }}>
                <li><strong>Age:</strong> Multi-century classical heritage.</li>
                <li><strong>Type:</strong> Multi-author canonical-consensus (Sage Parāśara, classical texts like BPHS) + guru-paramparā.</li>
                <li><strong>Validation:</strong> Long-established traditional authority + time-tested consensus.</li>
              </ul>
            </div>
          </div>

          {/* Self-check checkpoint quiz */}
          <div style={{
            background: "#ffffff", border: `1.5px solid ${STEEL_BORDER}`, borderRadius: "12px", padding: "16px",
            display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px"
          }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
              Checkpoint Quiz: KP Authority Basis
            </span>
            <p style={{ margin: 0, fontSize: "11.5px", fontWeight: 700, color: INK_PRIMARY }}>
              What forms the primary legitimacy base for KP's authority model in Grahvani's framework?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div
                onClick={() => !authSubmitted && setAuthSelected("opt1")}
                className={`quiz-option ${authSelected === "opt1" ? "selected" : ""} ${authSubmitted ? "submitted" : ""}`}
              >
                <input type="radio" checked={authSelected === "opt1"} readOnly style={{ pointerEvents: "none" }} />
                <span style={{ fontSize: "11px", color: INK_SECONDARY }}>Ancient Sanskrit ślokas written by Sage Parāśara</span>
              </div>
              <div
                onClick={() => !authSubmitted && setAuthSelected("opt2")}
                className={`quiz-option ${authSelected === "opt2" ? "selected" : ""} ${authSubmitted ? "submitted" : ""}`}
              >
                <input type="radio" checked={authSelected === "opt2"} readOnly style={{ pointerEvents: "none" }} />
                <span style={{ fontSize: "11px", color: INK_SECONDARY }}>A single founding author (Krishnamurti) + multi-decade community-verification + systematic methodology rigour</span>
              </div>
              <div
                onClick={() => !authSubmitted && setAuthSelected("opt3")}
                className={`quiz-option ${authSelected === "opt3" ? "selected" : ""} ${authSubmitted ? "submitted" : ""}`}
              >
                <input type="radio" checked={authSelected === "opt3"} readOnly style={{ pointerEvents: "none" }} />
                <span style={{ fontSize: "11px", color: INK_SECONDARY }}>Absolute Insular purity with zero integration of Western concepts</span>
              </div>
            </div>

            {!authSubmitted ? (
              <button
                onClick={handleVerifyAuthority}
                disabled={!authSelected}
                style={{
                  border: "none", background: STEEL_BLUE, color: "#fff", padding: "6px 12px",
                  borderRadius: "6px", fontSize: "10.5px", fontWeight: 750, cursor: "pointer",
                  opacity: authSelected ? 1 : 0.5, alignSelf: "flex-start", marginTop: "4px"
                }}
              >
                Submit Checkpoint
              </button>
            ) : (
              authFeedback && (
                <div style={{
                  background: authSelected === "opt2" ? GREEN_LIGHT : RED_LIGHT,
                  borderLeft: `3px solid ${authSelected === "opt2" ? "#4e7037" : "#ad4b37"}`,
                  padding: "10px", borderRadius: "0 8px 8px 0", fontSize: "11px", lineHeight: "1.45",
                  color: authSelected === "opt2" ? "#344e24" : "#762e21",
                  animation: "slideIn 0.25s ease"
                }}>
                  {authSelected === "opt2" ? (
                    <Smile size={14} style={{ display: "inline-block", marginRight: "6px", verticalAlign: "middle" }} />
                  ) : (
                    <AlertCircle size={14} style={{ display: "inline-block", marginRight: "6px", verticalAlign: "middle" }} />
                  )}
                  {authFeedback}
                </div>
              )
            )}
          </div>

          {/* Western horary cross-cultural note */}
          <div style={{
            background: "rgba(46, 64, 87, 0.04)", border: "1.5px solid rgba(46, 64, 87, 0.18)",
            borderRadius: "12px", padding: "12px", display: "flex", gap: "8px", alignItems: "flex-start"
          }}>
            <Info size={16} style={{ color: STEEL_BLUE, flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "11px", fontWeight: 800, color: STEEL_BLUE, textTransform: "uppercase" }}>
                Cross-Cultural-Absorption Callout (§4.5)
              </div>
              <p style={{ margin: "4px 0 0 0", fontSize: "10.5px", lineHeight: "1.5", color: INK_SECONDARY }}>
                The Reader Series explicitly integrates Western horary elements (William Lilly's 1647 Christian Astrology) with classical Indian nakṣatra theory. In Grahvani's pedagogy, this hybrid absorption is a feature of astrological evolution, not a corruption.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: `1px solid ${STEEL_BORDER}`,
        paddingTop: "8px",
        fontSize: "10px",
        color: INK_MUTED
      }}>
        <span>Module 16 · Chapter 1 · Lesson 2</span>
        <span>KP Reader Series Explorer</span>
      </div>
    </div>
  );
}
