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
  Unlock,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "attempt_compare" | "converging_streams" | "ethical_boundary";

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

function CareerJobOfferEvaluationSvg({ activeView }: { activeView: ViewKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Job Offer Multi-Stream Converging Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* 5 Converging Streams Box */}
      <g transform="translate(25, 25)">
        <rect x="0" y="0" width="300" height="130" rx="8" fill="#E8F5E9" stroke={GREEN} strokeWidth="1.5" />
        <text x="150" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">5 INDEPENDENT CONVERGING STREAMS (§6.1)</text>
        <text x="150" y="42" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Arjun (Virgo Lagna) Job-Offer Evaluation</text>
        <text x="150" y="60" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">1. Parāśari 10th & Lord (Mercury in 10th)</text>
        <text x="150" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">2. D10 Daśāṁśa Confirmation</text>
        <text x="150" y="90" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">3. Jaimini Amātyakāraka (Venus in 9th)</text>
        <text x="150" y="105" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">4. KP 10th Sub-Lord (6-10-11) + 5. Daśā/Transit</text>
        <text x="150" y="121" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">Verdict: STRONG INDICATION (5 Yeses)</text>
      </g>

      {/* Boundary Wall */}
      <line x1="345" y1="20" x2="345" y2="160" stroke={GOLD} strokeWidth="2" strokeDasharray="4 4" />
      <text x="345" y="15" textAnchor="middle" fill={GOLD} fontSize="9" fontWeight="600">SCOPE FENCE</text>

      {/* Ethical Scope Box */}
      <g transform="translate(365, 25)">
        <rect x="0" y="0" width="290" height="130" rx="8" fill="#FFF8E1" stroke={GOLD} strokeWidth="1.5" />
        <text x="145" y="22" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="600">ETHICAL BOUNDARY AUDIT (§6.2)</text>
        <text x="145" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Astrology vs Client Due Diligence</text>
        <text x="145" y="70" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">✓ ASTROLOGY: Suitability & Timing</text>
        <text x="145" y="88" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight="600">✗ CLIENT SCOPE: Salary, Contract, Commute</text>
        <text x="145" y="110" textAnchor="middle" fill={INK_SECONDARY} fontSize="8" fontWeight="500">Never let chart impersonate financial planner</text>
      </g>
    </svg>
  );
}

export function CareerJobOfferEvaluationWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("attempt_compare");
  const [isUnsealed, setIsUnsealed] = useState(false);

  // Student Attempt State
  const [studentPromise, setStudentPromise] = useState("");
  const [studentKp, setStudentKp] = useState("");
  const [studentWindow, setStudentWindow] = useState("");
  const [studentTier, setStudentTier] = useState("Strong Indication");

  const resetAll = () => {
    setActiveView("attempt_compare");
    setIsUnsealed(false);
    setStudentPromise("");
    setStudentKp("");
    setStudentWindow("");
    setStudentTier("Strong Indication");
  };

  return (
    <div data-interactive="career-case-1-job-offer-evaluation" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Module 22 Case Study 1 Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Career Case 1: Job-Offer Evaluation (Attempt-Then-Compare)
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Evaluating Arjun’s job-offer question using the 5-part multi-stream workflow (Parāśari, Jaimini, KP, Daśā, Transit) under the sealed attempt-then-compare protocol.
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
          <p style={EYEBROW_STYLE}>Job-Offer Multi-Stream Architecture (§4.1–§6.1)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>5 converging evidence streams and ethical scope boundaries</span>
        </div>
        <CareerJobOfferEvaluationSvg activeView={activeView} />
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
              onClick={() => setActiveView("converging_streams")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "converging_streams" ? GREEN : HAIRLINE}`,
                background: activeView === "converging_streams" ? "#E8F5E9" : "transparent",
                color: activeView === "converging_streams" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. 5 Converging Streams
            </button>
            <button
              type="button"
              onClick={() => setActiveView("ethical_boundary")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "ethical_boundary" ? BLUE : HAIRLINE}`,
                background: activeView === "ethical_boundary" ? "#EBF3FA" : "transparent",
                color: activeView === "ethical_boundary" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Ethical Scope & Trade-Offs
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
                    Record your own findings for Arjun’s chart before unsealing the worked solution:
                  </p>

                  <div style={{ display: "grid", gap: "0.6rem" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        1. Promise Verdict (10th, 10th Lord, D10, AmK):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Strong promise, Mercury in 10th own sign, AmK Venus in 9th"
                        value={studentPromise}
                        onChange={(e) => setStudentPromise(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        2. KP 10th Cuspal Sub-Lord Fructification:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Signifies 6th, 10th, 11th - gainful employment yes"
                        value={studentKp}
                        onChange={(e) => setStudentKp(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        3. Daśā Window (Mercury Mahādaśā, Venus Bhukti):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 10th lord and 9th lord active together (dharma-karma period)"
                        value={studentWindow}
                        onChange={(e) => setStudentWindow(e.target.value)}
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
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Promise:</strong> {studentPromise || "Recorded"}</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>KP:</strong> {studentKp || "Recorded"}</p>
                        <p style={{ margin: 0 }}>• <strong>Window:</strong> {studentWindow || "Recorded"}</p>
                      </div>

                      <div style={{ background: "#FFF", padding: "0.6rem", borderRadius: "0.35rem", border: `1px solid ${GREEN}` }}>
                        <strong style={{ color: GREEN, display: "block", marginBottom: "0.2rem" }}>Worked Solution:</strong>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Promise:</strong> Strong (10th lord Merc in 10th, AmK Ven in 9th, D10 clear)</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>KP:</strong> Yes (10th sub-lord signifies 6-10-11 employment)</p>
                        <p style={{ margin: 0 }}>• <strong>Window:</strong> Active (Merc-Ven 9th & 10th lords together)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View 2: 5 Converging Streams */}
          {activeView === "converging_streams" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  1. Parāśari Promise (Strong)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  10th house Gemini occupied by 10th lord Mercury in own sign + Jupiter 5th aspect from 6th.
                </p>
              </div>

              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  2. D10 Daśāṁśa Confirmation
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Career lord maintains dignity in D10 divisional chart; promise holds in career divisional.
                </p>
              </div>

              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  3. Jaimini Amātyakāraka (Venus in 9th)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Career minister Venus sits in own sign Taurus in 9th house of fortune.
                </p>
              </div>

              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  4. KP 10th Cuspal Sub-Lord (6-10-11)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Signifies 6th (service), 10th (career), 11th (gains) → Fructifies as gainful employment.
                </p>
              </div>

              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  5. Daśā & Transit Activation
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Mercury-Venus period activates 10th & 9th lords (dharma-karma) + Jupiter/Saturn transits support 10th axis.
                </p>
              </div>
            </div>
          )}

          {/* View 3: Ethical Scope & Trade-Offs */}
          {activeView === "ethical_boundary" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#EBF3FA", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${BLUE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Ethical Scope Boundary & Life Trade-Off Variant (§6.2)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  <strong>Scenario:</strong> Arjun mentions the offer requires relocating away from family with only a modest pay bump.
                  <br /><br />
                  <strong>Rule:</strong> The astrological reading does <em>not</em> change — the chart confirms a strong, well-timed move. But astrology evaluates <strong>suitability & timing</strong>, NOT salary, commute, or family trade-offs! Route contract and relocation decisions to Arjun&apos;s own due diligence and a financial planner.
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
                <strong>Attempt First:</strong> Record findings before unsealing solution.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>5 Converging Lines:</strong> 10th house, D10, AmK, KP sub-lord, Daśā/Transit.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>KP Sub-Lord 6-10-11:</strong> Fructification for job offer.
              </li>
              <li>
                <strong>Scope Fence:</strong> Route terms/salary to client due diligence.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
