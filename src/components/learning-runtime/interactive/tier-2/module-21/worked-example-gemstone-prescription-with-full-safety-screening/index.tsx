"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  FileCheck2,
  FileText,
  Flame,
  Gem,
  HelpCircle,
  Info,
  Layers,
  Lock,
  MessageSquare,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  ToggleLeft,
  ToggleRight,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "citrine_deliverable" | "refusal_vault" | "casefile_summary";
type ThreadKey = "chart_state" | "category_rule" | "correspondence_check" | "instance_potency";
type RationaleMode = "accessible" | "jargon";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

interface RefusalThread {
  title: string;
  shortDesc: string;
  fullDetail: string;
  sourceLesson: string;
  color: string;
}

const REFUSAL_THREADS: Record<ThreadKey, RefusalThread> = {
  chart_state: {
    title: "Thread 1: The Chart-State Fact",
    shortDesc: "Saturn is a 4th-house lord (kendra-only) debilitated in Aries, Mahādaśā-active → Pacify indicated.",
    fullDetail: "Lesson 21.1.2 derived Rohan's Saturn as a functional malefic placed in an enemy/debilitated sign without neecha-bhaṅga cancellation. Its Mahādaśā activation makes pacification urgent, not merely eligible.",
    sourceLesson: "Lesson 21.1.2 §4.4",
    color: VERMILION,
  },
  category_rule: {
    title: "Thread 2: The Category-Level Rule",
    shortDesc: "Pacify-indicated grahas NEVER receive resonance family remedies (Mantra, Yantra, Ratna).",
    fullDetail: "Lesson 21.1.3 §4.1 established that gemstones amplify planetary energy. Strengthening a functional malefic amplifies harm. This rule alone excludes any gemstone for Rohan's Saturn before asking stone-specific questions.",
    sourceLesson: "Lesson 21.1.3 §4.1 & 21.3.2 §4.3",
    color: PURPLE,
  },
  correspondence_check: {
    title: "Thread 3: Exact-Correspondence Check",
    shortDesc: "Blue Sapphire is Saturn's gem, but table-correctness ≠ prescription-correctness.",
    fullDetail: "The prior astrologer was factually right that Blue Sapphire is Saturn's classical gem (Nīlam). The error was skipping the directional gate check before consulting the table.",
    sourceLesson: "Lesson 21.3.2 §4.3",
    color: GOLD,
  },
  instance_potency: {
    title: "Thread 4: Instance-Level Potency",
    shortDesc: "Blue Sapphire is among the most potent/fast-acting gems, classical tradition requires caution.",
    fullDetail: "Lesson 21.3.3 §4.3 demonstrated that even if direction had passed, Blue Sapphire carries high astrological heat and fast potency requiring a 3-day test wear. Combining high potency with uncancelled debilitation is doubly unsafe.",
    sourceLesson: "Lesson 21.3.3 §4.3",
    color: BLUE,
  },
};

const CARD_STYLE: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: "0.75rem",
  padding: "1.25rem",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
};

const EYEBROW_STYLE: CSSProperties = {
  fontSize: "0.725rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: INK_MUTED,
  margin: 0,
};

function GemstoneCapstoneArchitectureSvg({ activeView, onSelectView }: { activeView: ViewKey; onSelectView: (view: ViewKey) => void }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Gemstone Capstone Dual-Track Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Track 1: Citrine Finished Prescription */}
      <g transform="translate(30, 25)" onClick={() => onSelectView("citrine_deliverable")} style={{ cursor: "pointer" }}>
        <rect x="0" y="0" width="290" height="130" rx="8" fill={activeView === "citrine_deliverable" ? "#E8F5E9" : "#FFF"} stroke={GREEN} strokeWidth={activeView === "citrine_deliverable" ? 2.5 : 1.5} />
        <text x="145" y="25" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight="600">TRACK 1: FINISHED PRESCRIPTION (§4.1)</text>
        <text x="145" y="55" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="600">Jupiter Citrine (Sunela)</text>
        <text x="145" y="78" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">4-Part Step-5 Deliverable Written</text>
        <text x="145" y="102" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">Click to Inspect Deliverable</text>
      </g>

      {/* Track 2: Blue Sapphire Refusal Vault */}
      <g transform="translate(355, 25)" onClick={() => onSelectView("refusal_vault")} style={{ cursor: "pointer" }}>
        <rect x="0" y="0" width="295" height="130" rx="8" fill={activeView === "refusal_vault" ? "#FDF2F0" : "#FFF"} stroke={VERMILION} strokeWidth={activeView === "refusal_vault" ? 2.5 : 1.5} />
        <text x="147" y="25" textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight="600">TRACK 2: REFUSAL VAULT (§4.2)</text>
        <text x="147" y="55" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="600">Saturn Blue Sapphire Refused</text>
        <text x="147" y="78" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">4 Independent Reasoning Threads</text>
        <text x="147" y="102" textAnchor="middle" fill={VERMILION} fontSize="10" fontWeight="600">Click to Inspect 4 Threads</text>
      </g>
    </svg>
  );
}

export function WorkedExampleGemstonePrescriptionWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("citrine_deliverable");
  const [activeThread, setActiveThread] = useState<ThreadKey>("chart_state");
  const [rationaleMode, setRationaleMode] = useState<RationaleMode>("accessible");

  const resetAll = () => {
    setActiveView("citrine_deliverable");
    setActiveThread("chart_state");
    setRationaleMode("accessible");
  };

  return (
    <div data-interactive="worked-example-gemstone-prescription-with-full-safety-screening" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Chapter 3 Capstone Worked Example Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Rohan’s Gemstone Case: Citrine Deliverable & Blue Sapphire Refusal Vault
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Closing Chapter 3 by synthesizing all five gemstone lessons: retracing Rohan’s Citrine prescription end-to-end and assembling the complete, formal four-thread case file against Blue Sapphire.
            </p>
          </div>
          <button
            type="button"
            onClick={resetAll}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "transparent",
              border: `1px solid ${HAIRLINE}`,
              borderRadius: "0.5rem",
              padding: "0.4rem 0.8rem",
              fontSize: "0.85rem",
              color: GOLD,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            <RotateCcw size={14} aria-hidden="true" />
            Reset View
          </button>
        </div>
      </section>

      {/* Vector Architecture Diagram */}
      <section style={CARD_STYLE}>
        <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
          <p style={EYEBROW_STYLE}>Chapter 3 Dual-Track Capstone Architecture</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Click either track box below to inspect its components</span>
        </div>
        <GemstoneCapstoneArchitectureSvg activeView={activeView} onSelectView={setActiveView} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main View Content Panel */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("citrine_deliverable")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "citrine_deliverable" ? GREEN : HAIRLINE}`,
                background: activeView === "citrine_deliverable" ? "#E8F5E9" : "transparent",
                color: activeView === "citrine_deliverable" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. Citrine Step-5 Deliverable
            </button>
            <button
              type="button"
              onClick={() => setActiveView("refusal_vault")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "refusal_vault" ? VERMILION : HAIRLINE}`,
                background: activeView === "refusal_vault" ? "#FDF2F0" : "transparent",
                color: activeView === "refusal_vault" ? VERMILION : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. 4-Thread Refusal Vault
            </button>
            <button
              type="button"
              onClick={() => setActiveView("casefile_summary")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "casefile_summary" ? BLUE : HAIRLINE}`,
                background: activeView === "casefile_summary" ? "#EBF3FA" : "transparent",
                color: activeView === "casefile_summary" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Case-File Audit Record
            </button>
          </div>

          {/* View 1: Citrine Step-5 Deliverable */}
          {activeView === "citrine_deliverable" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.4rem" }}>
                <p style={EYEBROW_STYLE}>The 4 Required Deliverable Parts for Citrine (§4.1)</p>
              </div>

              {/* Part 1: The Stone & Sourcing */}
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600 }}>1. The Stone & Sourcing Conventions</strong>
                  <span style={{ fontSize: "0.75rem", color: GREEN, background: "#E8F5E9", padding: "0.15rem 0.5rem", borderRadius: "0.25rem" }}>Resolved</span>
                </div>
                <p style={{ margin: "0.4rem 0 0", fontSize: "0.95rem", color: INK_PRIMARY, fontWeight: 500 }}>
                  Citrine (Sunela) — Uparatna substitute for Yellow Sapphire
                </p>
                <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, marginTop: "0.3rem", lineHeight: 1.4 }}>
                  Set to touch the skin, worn on index finger in gold or panchdhātu setting. Exact weight left to a qualified gemologist.
                </div>
              </div>

              {/* Part 2: Rationale Language Toggle */}
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                  <strong style={{ color: BLUE, fontSize: "0.9rem", fontWeight: 600 }}>2. Rationale Language</strong>
                  <div style={{ display: "flex", gap: "0.3rem" }}>
                    <button
                      type="button"
                      onClick={() => setRationaleMode("accessible")}
                      style={{
                        padding: "0.2rem 0.5rem",
                        fontSize: "0.75rem",
                        borderRadius: "0.25rem",
                        border: `1px solid ${rationaleMode === "accessible" ? BLUE : HAIRLINE}`,
                        background: rationaleMode === "accessible" ? BLUE : "transparent",
                        color: rationaleMode === "accessible" ? "#FFF" : INK_SECONDARY,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Accessible Client Language
                    </button>
                    <button
                      type="button"
                      onClick={() => setRationaleMode("jargon")}
                      style={{
                        padding: "0.2rem 0.5rem",
                        fontSize: "0.75rem",
                        borderRadius: "0.25rem",
                        border: `1px solid ${rationaleMode === "jargon" ? VERMILION : HAIRLINE}`,
                        background: rationaleMode === "jargon" ? VERMILION : "transparent",
                        color: rationaleMode === "jargon" ? "#FFF" : INK_SECONDARY,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Opaque Chart Jargon
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: "0.6rem", padding: "0.75rem", background: rationaleMode === "accessible" ? "#EBF3FA" : "#FDF2F0", borderRadius: "0.4rem", borderLeft: `3px solid ${rationaleMode === "accessible" ? BLUE : VERMILION}` }}>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                    {rationaleMode === "accessible" ? (
                      <span>
                        &ldquo;Citrine carries the same Jupiter-supporting quality as a yellow sapphire, at a gentler intensity and without the cost of the primary stone — a fitting first step given where your chart stands right now.&rdquo;
                      </span>
                    ) : (
                      <span>
                        &ldquo;Jupiter is a 5th lord trikoṇa placed in an enemy sign requiring a ratna strengthener; uparatna protocol resolves the cost dimension.&rdquo; (Opaque to client!)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Part 3: Practice Instructions & Joint Review */}
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: PURPLE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  3. Practice Instructions & Joint Review Point
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
                  Worn beginning on Thursday (Jupiter’s weekday). Reviewed at the same <strong>40-day maṇḍala checkpoint</strong> as the Guru Mantra, so both Jupiter-supporting layers are assessed together.
                </p>
              </div>

              {/* Part 4: Mitigation Framing */}
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  4. Mitigation-Not-Cure Framing
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
                  Restating T1-15 foundational doctrine: This gemstone is a support measure, not a guaranteed fix, and does not replace Rohan’s own active effort on his stalled creative project.
                </p>
              </div>
            </div>
          )}

          {/* View 2: 4-Thread Refusal Vault */}
          {activeView === "refusal_vault" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
                Four independent lessons built four separate threads against Rohan&apos;s Blue Sapphire. Any single thread closes the question; together they form a defensible case file (§4.2).
              </p>

              {/* Thread selector grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {(Object.keys(REFUSAL_THREADS) as ThreadKey[]).map((key) => {
                  const thread = REFUSAL_THREADS[key];
                  const isSelected = activeThread === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveThread(key)}
                      style={{
                        padding: "0.6rem 0.75rem",
                        borderRadius: "0.4rem",
                        border: `1px solid ${isSelected ? thread.color : HAIRLINE}`,
                        background: isSelected ? "#FDF2F0" : SURFACE,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <strong style={{ display: "block", fontSize: "0.825rem", color: thread.color, fontWeight: 600 }}>
                        {thread.title.split(":")[0]}
                      </strong>
                      <span style={{ fontSize: "0.775rem", color: INK_PRIMARY }}>{thread.title.split(":")[1]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Thread Details Card */}
              <div style={{ background: "#FDF2F0", padding: "1rem", borderRadius: "0.5rem", borderLeft: `4px solid ${REFUSAL_THREADS[activeThread].color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <strong style={{ fontSize: "0.95rem", color: REFUSAL_THREADS[activeThread].color, fontWeight: 600 }}>
                    {REFUSAL_THREADS[activeThread].title}
                  </strong>
                  <span style={{ fontSize: "0.75rem", color: INK_MUTED }}>{REFUSAL_THREADS[activeThread].sourceLesson}</span>
                </div>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  {REFUSAL_THREADS[activeThread].fullDetail}
                </p>
              </div>
            </div>
          )}

          {/* View 3: Case-File Audit Record */}
          {activeView === "casefile_summary" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FFF", padding: "0.9rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.925rem", fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                  Formal Practitioner Case-File Record (§4.3)
                </strong>

                {/* Jupiter Record */}
                <div style={{ background: "#E8F5E9", padding: "0.75rem", borderRadius: "0.4rem", marginBottom: "0.6rem", borderLeft: `3px solid ${GREEN}` }}>
                  <strong style={{ fontSize: "0.85rem", color: GREEN, display: "block", marginBottom: "0.2rem" }}>
                    GRAHA: JUPITER (Functional Benefic, Weak → Strengthen, Timely)
                  </strong>
                  <p style={{ margin: 0, fontSize: "0.825rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                    <strong>Prescribed:</strong> Guru Mantra (Finished, Ch 2) + Citrine (Finished, Ch 3), reviewed jointly at 40-day maṇḍala. Yellow Sapphire noted as available upgrade. Guru Yantra considered, declined (plan sufficient).
                  </p>
                </div>

                {/* Saturn Record */}
                <div style={{ background: "#FDF2F0", padding: "0.75rem", borderRadius: "0.4rem", borderLeft: `3px solid ${VERMILION}` }}>
                  <strong style={{ fontSize: "0.85rem", color: VERMILION, display: "block", marginBottom: "0.2rem" }}>
                    GRAHA: SATURN (Functional Malefic, Debilitated, Mahādaśā → Pacify, Urgent)
                  </strong>
                  <p style={{ margin: 0, fontSize: "0.825rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                    <strong>Refused:</strong> Gemstone category excluded (direction-gate + instance potency both confirm). Prior Blue Sapphire recommendation refused & documented. Pacify remedies (dāna, upavāsa) pending Chapter 5.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Sidebar Summary Card */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <div style={CARD_STYLE}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <Info size={16} color={GOLD} />
              <p style={{ ...EYEBROW_STYLE, color: GOLD }}>Chapter 3 Close Status (§4.4)</p>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Guru Mantra:</strong> Finished (Chapter 2).
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Citrine:</strong> Finished (Chapter 3).
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Saturn Dāna:</strong> Open (Routed to Chapter 5).
              </li>
              <li>
                <strong>Saturn Upavāsa:</strong> Open (Routed to Chapter 5).
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
