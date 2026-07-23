"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  FileCheck2,
  Flame,
  HelpCircle,
  Info,
  Layers,
  Lock,
  MessageSquare,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Unlock,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "attempt_compare" | "aptitude_tension" | "phased_timing_scope";

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

function EntrepreneurshipVsEmploymentSvg({ activeView }: { activeView: ViewKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Entrepreneurship vs Employment Phased Timing Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Independent Grain Box */}
      <g transform="translate(25, 25)">
        <rect x="0" y="0" width="195" height="130" rx="8" fill="#FFF8E1" stroke={GOLD} strokeWidth="1.5" />
        <text x="97" y="22" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="600">INDEPENDENT ENTERPRISE GRAIN</text>
        <text x="97" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Ruchaka Yoga + AmK</text>
        <text x="97" y="64" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Mars Exalted in 10th (Meṣa Lagna)</text>
        <text x="97" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Sun AmK in 9th (Authority/Fortune)</text>
        <text x="97" y="96" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• KP Sub-Lord: 7-11 (Enterprise/Gain)</text>
        <text x="97" y="117" textAnchor="middle" fill={GOLD} fontSize="9" fontWeight="600">Real Leadership Capacity</text>
      </g>

      {/* Tension Bridge */}
      <g transform="translate(230, 75)">
        <circle cx="20" cy="15" r="18" fill="#FFF" stroke={BLUE} strokeWidth="1.5" />
        <text x="20" y="19" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight="600">TENSION</text>
      </g>

      {/* Structured Employment Box */}
      <g transform="translate(260, 25)">
        <rect x="0" y="0" width="195" height="130" rx="8" fill="#EBF3FA" stroke={BLUE} strokeWidth="1.5" />
        <text x="97" y="22" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">STRUCTURED EMPLOYMENT GRAIN</text>
        <text x="97" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Saturnine 10th Lord</text>
        <text x="97" y="64" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Saturn Own Sign in 11th (Makara 10th)</text>
        <text x="97" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Systems, Service, Steady Accrual</text>
        <text x="97" y="96" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• KP 12th Flag: Capital-Intensive</text>
        <text x="97" y="117" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight="600">Employment Also Thrives</text>
      </g>

      {/* Arrow */}
      <path d="M 465 90 L 490 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Resolution: Phased Timing Box */}
      <g transform="translate(490, 25)">
        <rect x="0" y="0" width="165" height="130" rx="8" fill="#E8F5E9" stroke={GREEN} strokeWidth="2" />
        <text x="82" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">PHASED DAŚĀ RESOLUTION</text>
        <text x="82" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Saturn → Mars Sequence</text>
        <text x="82" y="70" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight="600">1. Saturn Now: Build in Job</text>
        <text x="82" y="88" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">2. Mars Bhukti (~18m): Leap Window</text>
        <text x="82" y="112" textAnchor="middle" fill={INK_SECONDARY} fontSize="8" fontWeight="500">Route financial risk to planner</text>
      </g>
    </svg>
  );
}

export function EntrepreneurshipVsEmploymentWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("attempt_compare");
  const [isUnsealed, setIsUnsealed] = useState(false);

  // Student Attempt State
  const [studentAptitude, setStudentAptitude] = useState("");
  const [studentTension, setStudentTension] = useState("");
  const [studentTiming, setStudentTiming] = useState("");

  const resetAll = () => {
    setActiveView("attempt_compare");
    setIsUnsealed(false);
    setStudentAptitude("");
    setStudentTension("");
    setStudentTiming("");
  };

  return (
    <div data-interactive="career-case-2-entrepreneurship-vs-employment-decision" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Module 22 Case Study 2 Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Career Case 2: Entrepreneurship vs Employment Decision
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Evaluating Priya’s two-sided career question — holding genuine aptitude tension in both directions, resolving it via phased daśā timing, and respecting scope boundaries.
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
            Reset Workbench
          </button>
        </div>
      </section>

      {/* Vector Architecture Diagram */}
      <section style={CARD_STYLE}>
        <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
          <p style={EYEBROW_STYLE}>Entrepreneurship vs Employment Phased Timing Architecture (§4.1–§6.1)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Two-sided aptitude tension, daśā sequencing, and KP 12th capital risk flag</span>
        </div>
        <EntrepreneurshipVsEmploymentSvg activeView={activeView} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("attempt_compare")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "attempt_compare" ? GOLD : HAIRLINE}`,
                background: activeView === "attempt_compare" ? "#FDFAF2" : "transparent",
                color: activeView === "attempt_compare" ? GOLD : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. Sealed Attempt Protocol
            </button>
            <button
              type="button"
              onClick={() => setActiveView("aptitude_tension")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "aptitude_tension" ? BLUE : HAIRLINE}`,
                background: activeView === "aptitude_tension" ? "#EBF3FA" : "transparent",
                color: activeView === "aptitude_tension" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Two-Sided Aptitude Tension
            </button>
            <button
              type="button"
              onClick={() => setActiveView("phased_timing_scope")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "phased_timing_scope" ? GREEN : HAIRLINE}`,
                background: activeView === "phased_timing_scope" ? "#E8F5E9" : "transparent",
                color: activeView === "phased_timing_scope" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Phased Daśā Timing & Scope
            </button>
          </div>

          {/* View 1: Attempt-Then-Compare Protocol */}
          {activeView === "attempt_compare" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              {!isUnsealed ? (
                <div style={{ background: "#FDFAF2", padding: "1rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GOLD, marginBottom: "0.5rem" }}>
                    <Lock size={18} />
                    <strong style={{ fontWeight: 600, fontSize: "0.95rem" }}>Sealed Attempt Workspace (§4.3)</strong>
                  </div>
                  <p style={{ margin: "0 0 0.8rem", fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                    Record your own reading for Priya’s chart before unsealing the worked solution:
                  </p>

                  <div style={{ display: "grid", gap: "0.6rem" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        1. Aptitude Grain (Independent vs Employment evidence):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ruchaka Mars in 10th (independent) vs Saturn 10th lord in 11th (structured)"
                        value={studentAptitude}
                        onChange={(e) => setStudentAptitude(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        2. Tension Resolution (Hold both vs Forced single answer):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Both modes viable - do NOT issue directive to quit/stay"
                        value={studentTension}
                        onChange={(e) => setStudentTension(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        3. Phased Daśā Timing (Saturn now → Mars Bhukti next):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Build within job under Saturn daśā now; launch window opens in Mars bhukti ~18m"
                        value={studentTiming}
                        onChange={(e) => setStudentTiming(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsUnsealed(true)}
                    style={{
                      marginTop: "1rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      background: GREEN,
                      color: "#FFF",
                      border: "none",
                      borderRadius: "0.4rem",
                      padding: "0.5rem 1rem",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Unlock size={16} />
                    Unseal & Compare Solution
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "0.85rem" }}>
                  <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GREEN, marginBottom: "0.3rem" }}>
                      <CheckCircle2 size={18} />
                      <strong style={{ fontWeight: 600, fontSize: "0.95rem" }}>Solution Side-by-Side Comparison (§6.1)</strong>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.5rem", fontSize: "0.85rem" }}>
                      <div style={{ background: "#FFF", padding: "0.6rem", borderRadius: "0.35rem", border: `1px solid ${HAIRLINE}` }}>
                        <strong style={{ color: GOLD, display: "block", marginBottom: "0.2rem" }}>Your Attempt:</strong>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Aptitude:</strong> {studentAptitude || "Recorded"}</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Tension:</strong> {studentTension || "Recorded"}</p>
                        <p style={{ margin: 0 }}>• <strong>Timing:</strong> {studentTiming || "Recorded"}</p>
                      </div>

                      <div style={{ background: "#FFF", padding: "0.6rem", borderRadius: "0.35rem", border: `1px solid ${GREEN}` }}>
                        <strong style={{ color: GREEN, display: "block", marginBottom: "0.2rem" }}>Worked Solution:</strong>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Aptitude:</strong> Both viable (Ruchaka Mars 10th vs Saturn 10th lord 11th)</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Tension:</strong> Hold both — aptitude is a tendency, not a directive</p>
                        <p style={{ margin: 0 }}>• <strong>Timing:</strong> Saturn now (build job) → Mars Bhukti (~18m leap window)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View 2: Two-Sided Aptitude Tension */}
          {activeView === "aptitude_tension" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ background: "#FFF8E1", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                <strong style={{ color: GOLD, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  1. Independent Enterprise Evidence
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  • <strong>Ruchaka Mahāpuruṣa Yoga:</strong> Mars exalted in 10th (Capricorn) as Lagna Lord & Ātmakāraka.
                  <br />• <strong>Amātyakāraka Sun in 9th:</strong> Career minister leans toward authority and independent standing.
                </p>
              </div>

              <div style={{ background: "#EBF3FA", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${BLUE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  2. Structured Employment Evidence
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  • <strong>Saturn 10th Lord in 11th (Aquarius):</strong> Strong 10th lord in own sign — Saturnine grain of structure, systems, and steady accrual of gains inside organisations.
                </p>
              </div>
            </div>
          )}

          {/* View 3: Phased Daśā Timing & Scope */}
          {activeView === "phased_timing_scope" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ color: GREEN, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Phased Daśā Timing & KP 12th Cost Flag (§6.1)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  • <strong>Saturn Mahādaśā / Moon Bhukti (Now):</strong> Dominant Saturn 10th lord favours building/preparing within job structure.
                  <br />
                  • <strong>Mars Bhukti (~18 Months Out):</strong> Ruchaka Mars sub-period opens the independent leap window.
                  <br />
                  • <strong>KP 12th Cusp Flag:</strong> 10th sub-lord touches 12th house → Enterprise fructifies but is capital-intensive. Route financial runway to a financial planner!
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Sidebar Summary Card */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <div style={CARD_STYLE}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <Info size={16} color={GOLD} />
              <p style={{ ...EYEBROW_STYLE, color: GOLD }}>Key Takeaways (§9)</p>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Aptitude != Directive:</strong> Aptitude is a tendency, not a command to quit.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Two-Sided Chart:</strong> Hold Ruchaka Mars vs Saturn 10th lord in tension.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Phased Timing:</strong> Saturn now (build job) → Mars Bhukti (leap window).
              </li>
              <li>
                <strong>KP 12th Flag:</strong> Venture is capital-heavy; route runway to planner.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
